import { existsSync } from 'fs';
import { resolve } from 'path';

/**
 * Vite plugin that allows overriding Hewcode React components.
 *
 * Developers can override any component from @hewcode/react by creating
 * a matching file in resources/js/hewcode/theme/
 *
 * Example:
 * To override @hewcode/react/components/form/TextInput
 * Create: resources/js/hewcode/theme/components/form/TextInput.tsx
 *
 * @returns {import('vite').Plugin}
 */
export function hewcodeTheme() {
    const themeDir = resolve(process.cwd(), 'resources/js/hewcode/theme');

    return {
        name: 'vite-plugin-hewcode-theme',

        resolveId(source, importer) {
            // Only intercept imports from @hewcode/react
            if (!source.startsWith('@hewcode/react/')) {
                return null;
            }

            // Extract the subpath after @hewcode/react/
            const subPath = source.replace('@hewcode/react/', '');

            // Check for override files with different extensions
            const extensions = ['.tsx', '.ts', '.jsx', '.js'];

            for (const ext of extensions) {
                const overridePath = resolve(themeDir, `${subPath}${ext}`);

                if (existsSync(overridePath)) {
                    // Return the override path
                    return overridePath;
                }
            }

            // No override found, let Vite resolve normally to the package
            return null;
        },
    };
}
