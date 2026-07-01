module.exports = {
  async init() {
    console.log('Hello World module initialized');
  },

  async start() {
    console.log('Hello World module started');
  },

  async stop() {
    console.log('Hello World module stopped');
  },

  greet(name) {
    return `Hello, ${name}!`;
  },
};
