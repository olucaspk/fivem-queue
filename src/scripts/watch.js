const { build } = require('esbuild');
const { filelocPlugin } = require('esbuild-plugin-fileloc');

build({
  bundle: true,
  sourcemap: 'inline',
  watch: {
    onRebuild(error, result) {
      if (error) console.error('Server watch build failed:', error);
      else console.log('Server watch build succeeded:', result);
    },
  },
  entryPoints: ['./src/server/index.ts'],
  outfile: './dist/server.js',
  platform: 'node',
  target: 'node16',
  plugins: [filelocPlugin()],
})
  .then(() => console.log('Built server files'))
  .catch(() => process.exit(1));

build({
  bundle: true,
  minify: false,
  watch: {
    onRebuild(error, result) {
      if (error) console.error('Client watch build failed:', error);
      else console.log('Client watch build succeeded:', result);
    },
  },
  sourcemap: 'inline',
  outfile: './dist/client.js',
  entryPoints: ['./src/client/index.ts'],
  platform: 'browser',
})
  .then(() => console.log('Built client files'))
  .catch(() => process.exit(1));
