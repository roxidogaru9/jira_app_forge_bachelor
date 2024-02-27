import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text, useProductContext } from '@forge/react';
import { requestJira, invoke } from '@forge/bridge';

const App = () => {
  const [data, setData] = useState(null);
  const context = useProductContext();
  // add these code to keep track of comments
  const [comments, setComments] = React.useState();

  useEffect(() => {
    invoke('getText', { example: 'my-invoke-variable' }).then(setData);
  }, []);

    const fetchCommentsForIssue = async (issueIdOrKey) => {
        const res = await requestJira(`/rest/api/3/issue/${issueIdOrKey}/comment`);
        const data = await res.json();
        return data.comments;
    };

    React.useEffect(() => {
        if (context) {
            // extract issue ID from the context
            const issueId = context.extension.issue.id;

            fetchCommentsForIssue(issueId).then(setComments);
        }
    }, [context]);

    React.useEffect(() => {
        console.log(`Number of comments on this issue: ${comments?.length}`);
    }, [comments]);

    return (
        <>
            <Text>Hello world!</Text>
            <Text>{data ? data : 'Loading...'}</Text>
            <Text>
                Number of comments on this issue: {comments?.length}
            </Text>
        </>
    );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
