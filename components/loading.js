import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../public/lottie/loading.json';

const Loading = () => {
  return (
    <div style={styles.container}>
      <Lottie animationData={loadingAnimation} loop={true} style={styles.animation} />
    </div>
  );
};

const styles = {
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

};

export default Loading;