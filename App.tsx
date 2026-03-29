import React, { useState } from 'react';
import InputForm from './components/InputForm';
import RPPView from './components/RPPView';
import { RPPData, UserInput } from './types';
import { generateRPP } from './services/geminiService';
import { generateDocx } from './services/docxService';
import { Sparkles, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [rppData, setRppData] = useState<RPPData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (input: UserInput) => {
    setIsLoading(true);
    setError(null);
    setRppData(null);
    try {
      const result = await generateRPP(input);
      setRppData(result);
    } catch (err) {
      console.error(err);
      setError("Gagal menyusun RPP. Pastikan koneksi internet stabil atau coba lagi beberapa saat. Detail: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!rppData) return;
    try {
      const blob = await generateDocx(rppData);
      const filename = `RPP_${rppData.identitas.mataPelajaran.replace(/\s+/g, '_')}_${rppData.identitas.kelasSemester.replace(/[\/\s]+/g, '_')}.docx`;
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Gagal membuat file Word. " + (e instanceof Error ? e.message : String(e)));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-600 to-purple-500 p-2 rounded-lg">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              DeepPlan AI
            </h1>
            <p className="text-xs text-gray-500">Generator RPP Pembelajaran Mendalam</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Form */}
          <div className="w-full lg:w-1/3 lg:min-w-[400px]">
            <div className="lg:sticky lg:top-24">
              <InputForm onSubmit={handleGenerate} isLoading={isLoading} />
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
                  <AlertCircle className="shrink-0 mt-0.5" size={20} />
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="w-full lg:w-2/3">
             {rppData ? (
               <RPPView data={rppData} onDownload={handleDownload} />
             ) : (
               <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-400">
                  {isLoading ? (
                    <div className="space-y-4 animate-pulse">
                      <div className="w-16 h-16 bg-indigo-100 rounded-full mx-auto mb-4"></div>
                      <h3 className="text-xl font-semibold text-gray-600">Sedang Menganalisis Kurikulum...</h3>
                      <p className="max-w-md mx-auto">AI sedang menyusun kerangka Deep Learning, membagi materi per topik pertemuan, dan merancang asesmen yang sesuai.</p>
                    </div>
                  ) : (
                    <>
                      <Sparkles size={48} className="mb-4 text-gray-300" />
                      <h3 className="text-xl font-semibold text-gray-500">RPP Belum Dibuat</h3>
                      <p>Silahkan isi formulir di sebelah kiri untuk mulai membuat RPP Otomatis.</p>
                    </>
                  )}
               </div>
             )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;