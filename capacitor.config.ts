import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.dash.athlete",
  appName: "DASH",
  // Capacitor copies from this directory into the native iOS/Android shells.
  // Build the static export with: `EXPORT=1 npm run build`
  webDir: "out",
  server: {
    androidScheme: "https",
  },
  ios: {
    contentInset: "always",
  },
  android: {
    backgroundColor: "#001226",
  },
};

export default config;
