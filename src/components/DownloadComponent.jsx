import React from 'react';

const DownloadComponent = () => {
    // Your GitHub release information
    const releaseInfo = {
        fileName: "JBMMSI.apk",
        fileSize: "95.2 MB",
        version: "v1.0.0",
        releaseDate: "November 2025"
    };

    const handleDownload = () => {
        console.log('Download started:', releaseInfo.fileName);
    };

    const handleGitHubClick = () => {
        window.open(releaseInfo.githubPage, '_blank');
    };

    return (
        <div id="download" className="download-section">
            <div className="container">
                {/* Header Section */}
                <div className="section-header">
                    <h1>JBMMSI Mobile App</h1>
                    <p className="tagline">Stay connected with quality education on the go</p>
                </div>

                <div className="download-content">
                    {/* App Image Section */}
                    <div className="app-preview">
                        <div className="phone-mockup">
                            <div className="phone-frame">
                                <img 
                                    src="/image/mobile.png" 
                                    alt="JBMMSI Mobile App"
                                    className="app-screenshot"
                                    onError={(e) => {
                                        e.target.style.backgroundColor = '#2c5aa0';
                                        e.target.style.display = 'flex';
                                        e.target.style.alignItems = 'center';
                                        e.target.style.justifyContent = 'center';
                                        e.target.style.color = 'white';
                                        e.target.style.fontSize = '10px';
                                        e.target.innerHTML = '📱 JBMMSI App Preview';
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Download Info Section */}
                    <div className="download-info">
                        <div className="mission-statement">
                              <h1>OUR MOBILE APP</h1>
                            <h3>
                              "It gives clarity in every class, connection at every change. Empowering teachers and students with a schedule that lives and breathes with your day, and announcements that reach you with purpose."
                            </h3>
                        </div>

                        {/* Download Section */}
                        <div className="download-action">
                            <h3>Download Now</h3>
                            <div className="version-info">
                                <span className="version">Version {releaseInfo.version}</span>
                                <span className="size">{releaseInfo.fileSize}</span>
                            </div>

                          <div className="download-buttons">
    <a 
        href="https://github.com/Thugtwist/apptest/releases/download/v1/JBMMSI.apk"
        download="JBMMSI.apk"
        className="download-btn primary"
        onClick={handleDownload}
    >
        <span className="btn-icon">📥</span>
        Download JBMMSI App
    </a>
</div>

                            <div className="file-details">
                                <div className="detail-item">
                                    <strong>File:</strong> {releaseInfo.fileName}
                                </div>
                                <div className="detail-item">
                                    <strong>Compatibility:</strong> Android 8.0+
                                </div>
                                <div className="detail-item">
                                    <strong>Last Updated:</strong> {releaseInfo.releaseDate}
                                </div>
                            </div>
                        </div>

                        {/* Installation Guide */}
                        <div className="installation-guide">
                            <h2>Installation Instructions</h2>
                            <div className="steps">
                                <div className="step">
                                    <span className="step-number">1</span>
                                    <p>Click "Download JBMMSI App" button</p>
                                </div>
                                <div className="step">
                                    <span className="step-number">2</span>
                                    <p>Open the downloaded APK file</p>
                                </div>
                                <div className="step">
                                    <span className="step-number">3</span>
                                    <p>Allow installation from unknown sources if prompted</p>
                                </div>
                                <div className="step">
                                    <span className="step-number">4</span>
                                    <p>Follow the installation steps</p>
                                </div>
                                <div className="step">
                                    <span className="step-number">5</span>
                                    <p>Launch the app and start learning!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DownloadComponent;
