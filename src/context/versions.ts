export type UiVersion =
  | 'v1'
  | 'v2'
  | 'v3'
  | 'v31'
  | 'v32'
  | 'v33'
  | 'v34'
  | 'v41'
  | 'v42'
  | 'v43'
  | 'v44'
  | 'v46'
  | 'v47'
  | 'v48'
  | 'v50'

/** Layout versions in switcher order; the last one opens by default. */
export const VERSIONS: UiVersion[] = [
  'v1',
  'v2',
  'v3',
  'v31',
  'v32',
  'v33',
  'v34',
  'v41',
  'v42',
  'v43',
  'v44',
  'v46',
  'v47',
  'v48',
  'v50',
]
