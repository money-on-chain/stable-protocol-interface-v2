import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    define: {
        // "process.env": process.env,
        // // By default, Vite doesn't include shims for NodeJS/
        // // necessary for segment analytics lib to work
        "global": {},
    },
    envPrefix: "REACT_APP_",
    plugins: [
        react(),
        svgr({
            svgrOptions: {
                // svgr options
            },
        })
    ],
    resolve: {
        mainFields: ['browser', 'module', 'jsnext'],
    },
})