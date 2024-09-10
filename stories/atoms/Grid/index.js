import React from 'react';

import { Grid } from 'src';

import { CodeBox } from 'storyUtils';
import data from './data';

function GridStory({ ...restProps }) {
  return <CodeBox title="Grid" withSandbox={false}>
        <Grid {...restProps} />
    </CodeBox>
}

const story = {
    info: {
        text: 'Grid'
    }
};

function GridStoryWrapper() {
  return <GridStory />
}

export default [GridStoryWrapper, story];
