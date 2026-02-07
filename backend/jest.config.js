process.env.MONGOMS_DOWNLOAD_DIR = 'D:/Projects/MERN projects/2_ecommerce_website/backend/.mongodb-binaries';

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testTimeout: 60000,
    verbose: true,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
};
