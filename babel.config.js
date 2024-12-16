module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // babel-preset-expo inclut toutes les configurations nécessaires
    env: {
      test: {
        plugins: ['@babel/plugin-transform-modules-commonjs'], // Plugin pour les tests
      },
    },
  };
};