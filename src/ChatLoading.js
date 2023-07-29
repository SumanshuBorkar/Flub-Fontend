import React from 'react';
import { css } from '@emotion/react';
import { PacmanLoader } from 'react-spinners';

const override = css`
  display: block;
  margin: 0 auto;
`;

const ChatLoading = () => {
  return (
    <div className="loading-spinner">
      <PacmanLoader css={override} size={25} color="#007bff" loading={true} />
    </div>
  );
};

export default ChatLoading;
