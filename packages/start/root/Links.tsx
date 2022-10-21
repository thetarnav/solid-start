import { JSX, useContext } from "solid-js";
import { useAssets } from "solid-js/web";
import { ServerContext } from "../server/ServerContext";
import { getAssetsFromManifest } from "./assets";

/**
 * Links are used to load assets for the server rendered HTML
 * @returns {JSXElement}
 */
export default function Links() {
  const isDev = import.meta.env.MODE === "development";
  const context = useContext(ServerContext);
  !isDev &&
    import.meta.env.START_SSR &&
    useAssets(() => {
      let match = getAssetsFromManifest(context.env.manifest, context.routerContext.matches);
      const links = match.reduce((r, src) => {
        let el =
          src.type === "style" ? (
            <link rel="stylesheet" href={src.href} $ServerOnly />
          ) : src.type === "script" ? (
            <link rel="modulepreload" href={src.href} $ServerOnly />
          ) : undefined;
        if (el) r[src.href] = el;
        return r;
      }, {} as Record<string, JSX.Element | null>);

      return Object.values(links);
    });
}
