import {
  OutputSchema as RepoEvent,
  isCommit,
} from './lexicon/types/com/atproto/sync/subscribeRepos'
import { FirehoseSubscriptionBase, getOpsByType } from './util/subscription'

export class FirehoseSubscription extends FirehoseSubscriptionBase {
  async handleEvent(evt: RepoEvent) {
    if (!isCommit(evt)) return

    const re = /#(worldfigure|worldsynchro|jgpfigure|gpfigure|eurofigure)/iu
    const ops = await getOpsByType(evt)

    const postsToDelete = ops.posts.deletes.map((del) => del.uri)
    const postsToCreate = ops.posts.creates
      .filter((create) => {
        return re.test(create.record.text)
      })
      .map((create) => {
        // A post might have multiple tags in it and we should really
        // iterate over all matches using .matchAll but that would require
        // departing from the structure of the example in a way that I don't
        // know enough JavaScript to do.
        // We do know for certain at this point that the text did match the
        // regexp, so it is safe to directly pull the matching subexpression
        // out when we redo the match with capture groups enabled.
        const subexp = create.record.text.match(re)![1]
        return {
          uri: create.uri,
          cid: create.cid,
          indexedAt: new Date().toISOString(),
          whichFeed: subexp!.toLowerCase(),
        }
      })

    if (postsToDelete.length > 0) {
      await this.db
        .deleteFrom('post')
        .where('uri', 'in', postsToDelete)
        .execute()
    }
    if (postsToCreate.length > 0) {
      await this.db
        .insertInto('post')
        .values(postsToCreate)
        .onConflict((oc) => oc.doNothing())
        .execute()
    }
  }
}
