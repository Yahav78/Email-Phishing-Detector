import { useState, useRef } from 'react';
import { ShieldCheck, ShieldAlert, Upload, Search, Loader2 } from 'lucide-react';

function App() {
  const [emailText, setEmailText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setEmailText(event.target.result);
    };
    reader.readAsText(file);
    // Reset file input so the same file can be uploaded again if needed
    e.target.value = null;
  };

  const scanEmail = async () => {
    if (!emailText.trim()) return;
    
    setIsScanning(true);
    setResult(null);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: emailText }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error scanning email:', error);
      alert('Error connecting to the backend server. Make sure it is running on port 3000.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
              <ShieldAlert className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Email Phishing Detector
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Paste your email content below or upload a .txt file to scan for malicious links, urgent language, and spoofed senders.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8 space-y-6">
            
            {/* Action Bar */}
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-slate-700">
                Email Content
              </label>
              
              <input
                type="file"
                accept=".txt"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload .txt file
              </button>
            </div>

            {/* Textarea */}
            <textarea
              className="w-full h-64 p-4 text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none font-mono text-sm leading-relaxed"
              placeholder="Dear customer, Your account has been suspended..."
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
            />

            {/* Scan Button */}
            <div className="flex justify-end">
              <button
                onClick={scanEmail}
                disabled={isScanning || !emailText.trim()}
                className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="w-6 h-6" />
                    Scan Email
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {result.isPhishing ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-2xl shadow-md">
                <div className="flex items-start">
                  <ShieldAlert className="w-8 h-8 text-red-500 mt-1 flex-shrink-0" />
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-red-800">
                      High Risk: Phishing Detected!
                    </h3>
                    <p className="text-red-700 mt-1 text-sm font-medium">
                      Our system found multiple indicators of a potential phishing attempt in this email.
                    </p>
                    <div className="mt-4">
                      <h4 className="text-sm font-bold text-red-800 uppercase tracking-wider mb-2">
                        Indicators Found:
                      </h4>
                      <ul className="space-y-2">
                        {result.indicators.map((indicator, index) => (
                          <li key={index} className="flex items-start text-sm text-red-700 bg-red-100/50 p-3 rounded-lg">
                            <span className="mr-2 text-red-500">•</span>
                            {indicator}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-2xl shadow-md">
                <div className="flex items-center">
                  <div className="p-2 bg-emerald-100 rounded-full">
                    <ShieldCheck className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-emerald-800">
                      Looks Safe
                    </h3>
                    <p className="text-emerald-700 mt-1 text-sm">
                      No immediate phishing indicators (like suspicious links, urgent language, or spoofed domains) were detected in this text.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
