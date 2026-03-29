import React, { useState } from 'react';
import { UserInput } from '../types';
import { Loader2, Send } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserInput>({
    namaSekolah: '',
    namaGuru: '',
    nipGuru: '',
    namaKepalaSekolah: '',
    nipKepalaSekolah: '',
    mataPelajaran: '',
    kelasSemester: '',
    alokasiWaktu: '4 JP',
    modelPembelajaran: '',
    capaianPembelajaran: '',
    tujuanPembelajaran: '',
    instruksiTambahan: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="border-b pb-4 mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">A</span>
          Identitas RPP
        </h2>
        <p className="text-gray-500 text-sm mt-1">Lengkapi data administrasi dasar sekolah dan guru.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Sekolah</label>
          <input
            required
            name="namaSekolah"
            value={formData.namaSekolah}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            placeholder="Contoh: SMA Negeri 1 ..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran</label>
          <input
            required
            name="mataPelajaran"
            value={formData.mataPelajaran}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            placeholder="Contoh: Fisika"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Guru</label>
          <input
            required
            name="namaGuru"
            value={formData.namaGuru}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            placeholder="Nama Lengkap dengan Gelar"
          />
        </div>
         <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">NIP Guru</label>
          <input
            name="nipGuru"
            value={formData.nipGuru}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            placeholder="NIP ..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kepala Sekolah</label>
          <input
            required
            name="namaKepalaSekolah"
            value={formData.namaKepalaSekolah}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            placeholder="Nama Lengkap dengan Gelar"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">NIP Kepala Sekolah</label>
          <input
            name="nipKepalaSekolah"
            value={formData.nipKepalaSekolah}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            placeholder="NIP ..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kelas / Semester</label>
          <input
            required
            name="kelasSemester"
            value={formData.kelasSemester}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            placeholder="Contoh: X / Ganjil"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alokasi Waktu</label>
          <input
            required
            name="alokasiWaktu"
            value={formData.alokasiWaktu}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            placeholder="Contoh: 4 JP (Akan dibagi 2JP/Pertemuan)"
          />
        </div>
      </div>

      <div className="border-b pb-4 mt-8 mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">B</span>
          Substansi Pembelajaran
        </h2>
        <p className="text-gray-500 text-sm mt-1">Detail materi dan tujuan yang ingin dicapai.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Model Pembelajaran</label>
          <input
            required
            name="modelPembelajaran"
            value={formData.modelPembelajaran}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            placeholder="Contoh: Problem Based Learning (PBL)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Capaian Pembelajaran (CP)</label>
          <textarea
            required
            rows={3}
            name="capaianPembelajaran"
            value={formData.capaianPembelajaran}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            placeholder="Salin CP dari kurikulum..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tujuan Pembelajaran (TP)</label>
          <textarea
            required
            rows={3}
            name="tujuanPembelajaran"
            value={formData.tujuanPembelajaran}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            placeholder="Tuliskan tujuan pembelajaran yang ingin dicapai..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Instruksi Tambahan (Opsional)</label>
          <textarea
            rows={2}
            name="instruksiTambahan"
            value={formData.instruksiTambahan}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            placeholder="Contoh: Fokuskan pada penggunaan alat peraga sederhana..."
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" />
              Sedang Menyusun RPP...
            </>
          ) : (
            <>
              <Send size={20} />
              Buat RPP Sekarang
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default InputForm;
