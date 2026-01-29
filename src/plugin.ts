import fs from "fs";
import path from "path";
import type { Compiler } from "@rspack/core";

type LoaderType = "line" | "dots" | "none";

type PluginOptions = {
  logoSrc: string;
  splashBg?: string;
  loaderBg?: string;
  loaderType?: LoaderType;
  minDurationMs?: number;
};

export class RspackSplashScreenPlugin {
  private options: Required<PluginOptions>;
  private publicDir: string;

  constructor(options: PluginOptions) {
    if (!options.logoSrc) {
      throw new Error(
        "The `logoSrc` option is required for rspack-plugin-splash-screen!"
      );
    }

    this.options = {
      logoSrc: options.logoSrc,
      minDurationMs: options.minDurationMs ?? 0,
      loaderType: options.loaderType ?? "line",
      loaderBg: options.loaderBg ?? "#0072f5",
      splashBg: options.splashBg ?? "#ffffff",
    };

    this.publicDir = "public"; // Default public directory
  }

  apply(compiler: Compiler) {
    const pluginName = "RspackSplashScreenPlugin";

    // Hook into the compilation process to modify HTML
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      // Use the HtmlRspackPlugin hooks if available
      const hooks = (compilation.hooks as any).htmlRspackPluginAlterAssetTags;
      
      if (hooks) {
        hooks.tap(pluginName, (data: any) => {
          // Get the HTML processing hook
          const htmlProcessHook = (compilation.hooks as any).processAssets;
          
          if (htmlProcessHook) {
            htmlProcessHook.tap(
              {
                name: pluginName,
                stage: (compilation.constructor as any).PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE,
              },
              () => {
                // Find and modify HTML assets
                const assets = compilation.getAssets();
                
                assets.forEach((asset) => {
                  if (asset.name.endsWith('.html')) {
                    const html = asset.source.source().toString();
                    const modifiedHtml = this.transformHtml(html);
                    
                    compilation.updateAsset(asset.name, {
                      source: () => modifiedHtml,
                      size: () => modifiedHtml.length,
                    } as any);
                  }
                });
              }
            );
          }
          
          return data;
        });
      }
    });

    // Alternative approach: Use processAssets hook directly
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: (compiler.webpack as any).Compilation?.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE ?? 100,
        },
        () => {
          const assets = compilation.getAssets();
          
          assets.forEach((asset) => {
            if (asset.name.endsWith('.html')) {
              const html = asset.source.source().toString();
              const modifiedHtml = this.transformHtml(html);
              
              compilation.updateAsset(asset.name, {
                source: () => modifiedHtml,
                size: () => modifiedHtml.length,
              } as any);
            }
          });
        }
      );
    });
  }

  private transformHtml(html: string): string {
    const baseStyles = readPluginFile("styles.css");

    let loaderStyles = "";

    if (this.options.loaderType === "line") {
      loaderStyles = readPluginFile("loaders/line.css");
    } else if (this.options.loaderType === "dots") {
      loaderStyles = readPluginFile("loaders/dots.css");
    }

    // Resolve logo path - try multiple locations
    let logoHtml = "";
    const possiblePaths = [
      path.resolve(this.publicDir, this.options.logoSrc),
      path.resolve(process.cwd(), this.publicDir, this.options.logoSrc),
      path.resolve(process.cwd(), "public", this.options.logoSrc),
    ];

    for (const logoPath of possiblePaths) {
      if (fs.existsSync(logoPath)) {
        logoHtml = fs.readFileSync(logoPath, "utf8");
        break;
      }
    }

    if (!logoHtml) {
      console.warn(
        `[rspack-plugin-splash-screen] Logo not found at any of: ${possiblePaths.join(", ")}`
      );
    }

    const splash = splashTemplate({
      logoHtml,
      loaderType: this.options.loaderType,
      minDurationMs: this.options.minDurationMs,
    });

    const b = baseStyles.replace("/*BG_SPLASH*/", this.options.splashBg);
    const l = loaderStyles.replace("/*BG_LOADER*/", this.options.loaderBg);

    const styles = `<style id="vpss-style">${b}${l}</style>`;

    return (
      html
        // Add styles to end of head
        .replace("</head>", `${styles}</head>`)
        // Add splash screen to end of body
        .replace("</body>", `${splash}</body>`)
    );
  }
}

// Export a factory function for easier usage (similar to Vite plugin style)
export function splashScreen(options: PluginOptions) {
  return new RspackSplashScreenPlugin(options);
}

function splashTemplate({
  logoHtml,
  loaderType,
  minDurationMs,
}: {
  logoHtml: string;
  loaderType: LoaderType;
  minDurationMs?: number;
}) {
  /**
   * TODO: add more loader options.
   * Inspiration: https://cssloaders.github.io/
   */
  let loaderHtml = "";

  if (loaderType === "line") {
    loaderHtml = readPluginFile("loaders/line.html");
  } else if (loaderType === "dots") {
    loaderHtml = readPluginFile("loaders/dots.html");
  }

  return /*html*/ `
    <div id="vpss">
      <div class="vpss-logo">${logoHtml}</div>
      ${loaderHtml}
    </div>
    <script>
      (function () {
        const id = "vpss";
        const url = new URL(window.location.href);
        const urlParams = new URLSearchParams(url.search)
        const param = urlParams.get(id);
        
        // Setup global options
        window.__VPSS__ = {
          id: id,
          hidden: param === "false",
          renderedAt: new Date().getTime(),
          minDurationMs: ${minDurationMs || 0},
          getElement: function() {
            return document.getElementById(id);
          },
          getStyles: function() {
            return document.getElementById(id + "-style");
          },
          show: function () {
            const element = this.getElement();
            if (!element) return;

            element.style.visibility = "visible";
          },
          hide: async function () {
            const element = this.getElement();
            if (!element) return;

            // Set hidden flag to prevent multiple calls
            this.hidden = true;

            // Optionally wait for minDurationMs before starting animation
            if (
              this.minDurationMs !== undefined &&
              this.renderedAt !== undefined
            ) {
              const elapsedTime = new Date().getTime() - this.renderedAt;
              const remainingTime = Math.max(this.minDurationMs - elapsedTime, 0);
              await new Promise((resolve) => setTimeout(resolve, remainingTime));
            }

            const animation = element.animate(
              [{ opacity: 1 }, { opacity: 0 }],
              { duration: 200, easing: "ease-out", fill: "forwards" }
            );

            animation.onfinish = () => {
              this.remove();
            };
          },
          remove: function () {
            const element = this.getElement();
            const styles = this.getStyles();

            if (element && styles) {
              element.remove();
              styles.remove();
            }
          }
        };

        if (window.__VPSS__.hidden) {
          window.__VPSS__.remove();
        } else {
          window.__VPSS__.show();
        }
        
        // Remove query param from URL
        if (param) {
          urlParams.delete(id);
          url.search = urlParams.toString();
          window.history.replaceState({}, "", url);
        }
      })();
    </script>
  `;
}

// TODO: is there an easier way to resolve static files relative to the plugin?
const pluginPath = "node_modules/rspack-plugin-splash-screen/src";

function readPluginFile(filePath: string) {
  return fs.readFileSync(path.resolve(pluginPath, filePath), "utf8");
}
