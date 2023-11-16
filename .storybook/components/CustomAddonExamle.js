// CUSTOM ADDON EXAMPLE

// import React, { useCallback } from 'react';
// import { useGlobals } from '@storybook/api';
//
//
// export const RtlAddOn = () => {
//     const [{outlineActive}, updateGlobals] = useGlobals();
//
//     const toggleOutline = useCallback(
//         () =>
//             updateGlobals({
//                 outlineActive: !outlineActive,
//             }),
//         [outlineActive]
//     );
//     console.log(outlineActive)
//     return (
//         <span
//             style={{
//                 background: 'transparent', display: 'flex',
//                 'align-items': 'center', cursor: 'pointer',
//                 'user-select': 'none',
//                 'margin':'5px',
//                 'padding':'0 ,10px',
//                 fontWeight:700,
//                 'background-color': 'rgba(30,167,253,0.07)',
//             ...(outlineActive? {'color': '#1EA7FD'}:{})
//             }}
//             key={'TOOL_ID'}
//             // active={outlineActive}
//             title="Apply outlines to the preview"
//             onClick={toggleOutline}
//         >
//         {/*<Icons icon="outline" />*/}
//             RTL
//         </span>
//     );
// };
