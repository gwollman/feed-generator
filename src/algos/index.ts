import { AppContext } from '../config'
import {
  QueryParams,
  OutputSchema as AlgoOutput,
} from '../lexicon/types/app/bsky/feed/getFeedSkeleton'
import * as allISU from './allCompetitions'
import * as worldFigure from './worldFigure'
import * as worldSynchro from './worldSynchro'
import * as jgpFigure from './jgpFigure'
import * as gpFigure from './gpFigure'
import * as euroFigure from './euroFigure'

type AlgoHandler = (ctx: AppContext, params: QueryParams) => Promise<AlgoOutput>

const algos: Record<string, AlgoHandler> = {
  [allISU.shortname]: allISU.handler,
  [worldFigure.shortname]: worldFigure.handler,
  [worldSynchro.shortname]: worldSynchro.handler,
  [jgpFigure.shortname]: jgpFigure.handler,
  [gpFigure.shortname]: gpFigure.handler,
  [euroFigure.shortname]: euroFigure.handler,
}

export default algos
