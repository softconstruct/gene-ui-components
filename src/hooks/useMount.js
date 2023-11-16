import { useEffect } from 'react';

import { noop } from 'utils';

const useMount = (onMount = noop) => useEffect(onMount, []);

export default useMount;
