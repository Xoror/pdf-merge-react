import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
    server: {
        port: 3000,
    },
    resolve: {
        tsconfigPaths: true
    },
    optimizeDeps: {
        rolldownOptions: {
            output: {
                strictExecutionOrder: true
            }
        }
    },
    build: {
        rolldownOptions: {
            output: {
                codeSplitting: true,
                strictExecutionOrder: true
            }
        },
    },
    plugins: [
        react(),
        visualizer(),        babel({ presets: [reactCompilerPreset()] })
    ],
})
