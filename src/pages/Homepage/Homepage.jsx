import { useState } from "react";
import logo from "../../assets/images/steeltech_logo.svg";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

const APK_DOWNLOAD_URL = "https://transfer.ongshak.com/static/steeltech/mar.apk";

const HomePage = () => {
  const [showUpdateGuide, setShowUpdateGuide] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              {/* <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ST</span>
              </div> */}
              <img src={logo} alt="" className="w-16 h-auto" />
              <div>
                <h1 className="font-bold text-gray-900 text-lg">Steeltech</h1>
                <p className="text-xs text-gray-600">
                  Steel Manufacturing Network
                </p>
              </div>
            </div>
            <Link to="/fabricator-registration">
              <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-500 cursor-pointer transition-colors font-medium text-sm">
                Join Network
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Join Bangladesh's
            <span className="text-primary block">Steeltech Network</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Connect with trusted steel manufacturers, expand your business
            reach, and grow with Bangladesh's most reliable steel fabrication
            network.
          </p>

          {/* Value Propositions */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Trusted Network
              </h3>
              <p className="text-gray-600 text-sm">
                Join over 500+ verified fabricators across Bangladesh in our
                trusted manufacturing network.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Business Growth
              </h3>
              <p className="text-gray-600 text-sm">
                Access new opportunities, increase your project volume, and
                expand your business reach nationwide.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Quality Assurance
              </h3>
              <p className="text-gray-600 text-sm">
                Maintain high standards with our quality verification process
                and professional support system.
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-2xl p-8 shadow-sm mb-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-gray-600 text-sm">Active Fabricators</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <div className="text-gray-600 text-sm">Districts Covered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  1000+
                </div>
                <div className="text-gray-600 text-sm">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-gray-600 text-sm">Support Available</div>
              </div>
            </div>
          </div>

          {/* App Installation & Update Guide */}
          <div className="bg-white rounded-2xl p-8 shadow-sm mb-12 text-left">
            <div className="grid md:grid-cols-2 gap-10 items-start">
              {/* Left: Installation Guide */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Download the App
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Steeltech Marketing Representative – Installation Guide
                </p>

                <div className="space-y-5">
                  <div>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                        1
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Download</p>
                        <p className="text-sm text-gray-600">
                          Click the "Download APK" button above to download the
                          Steeltech Marketing Representative app. Once the
                          download is complete, open the APK file from your
                          notification bar.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                        2
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">
                          Allow Installation from Unknown Sources
                        </p>
                        <p className="text-sm text-gray-600">
                          If prompted, go to{" "}
                          <span className="font-medium text-gray-800">
                            Settings → Security → Install Unknown Apps
                          </span>{" "}
                          and allow your browser or file manager to install apps
                          from unknown sources.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                        3
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">
                          Play Protect Warning
                        </p>
                        <p className="text-sm text-gray-600">
                          Tap{" "}
                          <span className="font-medium text-gray-800">
                            "Install Anyway"
                          </span>
                          . Google Play Protect may display a warning such as:
                          "This app was not built by Google Play." If this
                          appears, tap "Install anyway" to continue installing
                          the Steeltech Marketing Representative app.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                        4
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">
                          Complete Installation
                        </p>
                        <p className="text-sm text-gray-600">
                          After the installation is finished, tap "Open" or
                          launch Steeltech Marketing Representative from your
                          app drawer.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Having Trouble */}
                <div className="mt-6 bg-orange-50 rounded-lg p-4 border border-orange-100">
                  <p className="font-semibold text-gray-800 mb-2">
                    Having Trouble Installing?
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    If Google Play Store or Play Protect prevents the
                    installation, follow these steps:
                  </p>
                  <ol className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-orange-600 shrink-0">1.</span>
                      <span>
                        <span className="font-medium text-gray-800">
                          Disable Google Play Store
                        </span>{" "}
                        – Go to{" "}
                        <span className="font-medium text-gray-800">
                          Settings → Apps
                        </span>{" "}
                        (or Application Manager), find Google Play Store, and
                        tap Disable.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-orange-600 shrink-0">2.</span>
                      <span>
                        <span className="font-medium text-gray-800">
                          Force Stop Google Play Store
                        </span>{" "}
                        – On the same screen, tap "Force Stop" and confirm if
                        prompted.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-orange-600 shrink-0">3.</span>
                      <span>
                        <span className="font-medium text-gray-800">
                          Install the APK
                        </span>{" "}
                        – Open the downloaded Steeltech Marketing Representative
                        APK file again and tap Install.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-orange-600 shrink-0">4.</span>
                      <span>
                        <span className="font-medium text-gray-800">
                          Re-enable Google Play Store
                        </span>{" "}
                        – Once the installation is complete, go to{" "}
                        <span className="font-medium text-gray-800">
                          Settings → Apps → Google Play Store
                        </span>{" "}
                        and tap Enable.
                      </span>
                    </li>
                  </ol>
                  <p className="text-xs text-orange-700 mt-3 font-medium">
                    Important: Re-enable Google Play Store after installation to
                    ensure normal app updates and Play Store functionality.
                  </p>
                </div>

                {/* Update Guide toggle */}
                <div className="mt-6">
                  <button
                    onClick={() => setShowUpdateGuide(!showUpdateGuide)}
                    className="flex items-center gap-2 text-orange-600 font-medium text-sm cursor-pointer hover:text-orange-700 transition-colors"
                  >
                    <span>Already installed? View Update Guide</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${showUpdateGuide ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {showUpdateGuide && (
                    <div className="mt-4 border border-gray-200 rounded-lg p-5 space-y-4">
                      <p className="font-semibold text-gray-900 text-sm">
                        Steeltech Marketing Representative – Update Guide
                      </p>

                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            1
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm mb-0.5">
                              Download the Latest APK
                            </p>
                            <p className="text-sm text-gray-600">
                              Click the "Download APK" button above to get the
                              latest version of the app.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            2
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm mb-0.5">
                              Install Over Existing App
                            </p>
                            <p className="text-sm text-gray-600">
                              Open the downloaded APK file. Android will detect
                              the existing installation and prompt you to update.
                              Tap "Install" to proceed — your data will be
                              preserved.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            3
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm mb-0.5">
                              Play Protect Warning
                            </p>
                            <p className="text-sm text-gray-600">
                              If Google Play Protect shows a warning, tap
                              "Install anyway" to continue.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            4
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm mb-0.5">
                              Done
                            </p>
                            <p className="text-sm text-gray-600">
                              Once installation completes, tap "Open" to launch
                              the updated app.
                            </p>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md border border-gray-100">
                        <span className="font-medium text-gray-700">Note:</span>{" "}
                        You do not need to uninstall the existing app. Installing
                        the new APK over it will update the app while keeping
                        your login and data intact.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: QR Code + Download */}
              <div className="flex flex-col items-center">
                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-100 flex flex-col items-center w-full max-w-xs">
                  <QRCodeSVG
                    value={APK_DOWNLOAD_URL}
                    size={200}
                    fgColor="#1f2937"
                    bgColor="#ffffff"
                  />
                  <p className="text-sm font-medium text-gray-700 mt-4">
                    Scan to Install
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Android 6.0+</p>
                </div>

                <a
                  href={APK_DOWNLOAD_URL}
                  download
                  className="mt-6 w-full max-w-xs bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download APK
                </a>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-primary to-orange-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Join Our Network?
            </h2>
            <p className="text-orange-100 mb-6 text-lg">
              Start your journey with Steeltech today. Complete your
              registration in just a few minutes and unlock new business
              opportunities.
            </p>
            <Link to="/fabricator-registration">
              <button className="bg-white text-orange-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg inline-flex items-center space-x-2 cursor-pointer">
                <span>Register as Fabricator</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </Link>
            <Link to="/admin/login">
              <p className="text-right">
                Login as <span className="font-bold">Admin</span>
              </p>
            </Link>
          </div>

          {/* Additional Info */}
          {/* <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              Already registered?{" "}
              <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">
                Sign in to your account
              </a>
            </p>
          </div> */}
        </div>
      </main>

      {/* Footer */}
      {/* <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">ST</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Steeltech</div>
                <div className="text-xs text-gray-600">Building Bangladesh's Future</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              © 2024 Steeltech. All rights reserved. | Building stronger communities through quality steel.
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default HomePage;
