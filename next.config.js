module.exports = {
  images: {
    domains: ['firebasestorage.googleapis.com',"res.cloudinary.com","images.unsplash.com" ],
    },
    webpack: (config) => {

      config.module.rules.push({
        test: /\.js$/,
        include: /node_modules/,
        type: "javascript/auto",
        
      });
      
  
      return config;
    },
  };
  