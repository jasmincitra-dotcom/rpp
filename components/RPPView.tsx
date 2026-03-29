
import React from 'react';
import { RPPData } from '../types';
import { Download, CheckSquare, Square } from 'lucide-react';

interface RPPViewProps {
  data: RPPData;
  onDownload: () => void;
}

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3 border-b-2 border-gray-200 pb-1 uppercase">
    {title}
  </h3>
);

const LabelValue: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="mb-2">
    <span className="font-semibold text-gray-700">{label}:</span> <span className="text-gray-800">{value || "-"}</span>
  </div>
);

const RPPView: React.FC<RPPViewProps> = ({ data, onDownload }) => {
  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in duration-700">
      <div className="bg-gray-50 border-b p-4 flex justify-between items-center sticky top-0 z-10">
        <h2 className="font-bold text-gray-700">Pratinjau Dokumen (Format Word: TNR 12)</h2>
        <button
          onClick={onDownload}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium shadow-sm"
        >
          <Download size={18} />
          Download Word (.docx)
        </button>
      </div>

      <div className="p-8 md:p-12 max-w-4xl mx-auto font-serif leading-relaxed text-sm md:text-base bg-white" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
        <h1 className="text-2xl font-bold text-center mb-8 uppercase tracking-wide">Rencana Pelaksanaan Pembelajaran (RPP)</h1>

        <SectionHeader title="A. Identitas Modul" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LabelValue label="Nama Sekolah" value={data.identitas.namaSekolah} />
          <LabelValue label="Mata Pelajaran" value={data.identitas.mataPelajaran} />
          <LabelValue label="Nama Guru" value={`${data.identitas.namaGuru} (NIP: ${data.identitas.nipGuru || "-"})`} />
          <LabelValue label="Kelas/Semester" value={data.identitas.kelasSemester} />
          <LabelValue label="Kepala Sekolah" value={`${data.identitas.namaKepalaSekolah} (NIP: ${data.identitas.nipKepalaSekolah || "-"})`} />
          <LabelValue label="Alokasi Waktu" value={data.identitas.alokasiWaktu} />
        </div>

        <SectionHeader title="B. Identifikasi Kesiapan Peserta Didik" />
        <LabelValue label="Pengetahuan Awal" value={data.kesiapanPesertaDidik?.pengetahuanAwal} />
        <LabelValue label="Minat" value={data.kesiapanPesertaDidik?.minat} />
        <LabelValue label="Latar Belakang" value={data.kesiapanPesertaDidik?.latarBelakang} />
        <LabelValue label="Kebutuhan Belajar" value={data.kesiapanPesertaDidik?.kebutuhanBelajar} />

        <SectionHeader title="C. Karakteristik Materi Pelajaran" />
        <LabelValue label="Jenis Pengetahuan" value={data.karakteristikMateri?.jenisPengetahuan} />
        <LabelValue label="Relevansi" value={data.karakteristikMateri?.relevansi} />
        <LabelValue label="Tingkat Kesulitan" value={data.karakteristikMateri?.tingkatKesulitan} />
        <LabelValue label="Integrasi Nilai" value={data.karakteristikMateri?.integrasiNilai} />

        <SectionHeader title="D. Dimensi Profil Lulusan" />
        <div className="grid grid-cols-2 gap-2">
          {(data.dimensiProfilPelajar || []).map((dim, idx) => (
             <div key={idx} className={`flex items-center gap-2 ${dim.terpilih ? 'text-indigo-700 font-bold' : 'text-gray-400'}`}>
                {dim.terpilih ? <CheckSquare size={16} /> : <Square size={16} />}
                <span>{dim.nama}</span>
             </div>
          ))}
        </div>

        <SectionHeader title="E. Desain Pembelajaran" />
        <div className="space-y-4">
          <div>
             <h4 className="font-bold text-gray-800">1. Capaian Pembelajaran</h4>
             <p className="whitespace-pre-wrap">{data.desainPembelajaran?.capaianPembelajaran}</p>
          </div>
          <div>
             <h4 className="font-bold text-gray-800">2. Lintas Disiplin Ilmu</h4>
             <p>{data.desainPembelajaran?.lintasDisiplin}</p>
          </div>
          <div>
             <h4 className="font-bold text-gray-800">3. Tujuan Pembelajaran</h4>
             <p>{data.desainPembelajaran?.tujuanPembelajaranUmum}</p>
          </div>
          <div>
             <h4 className="font-bold text-gray-800">4. Topik Pembelajaran Kontekstual</h4>
             <p>{data.desainPembelajaran?.topikPembelajaran}</p>
          </div>
          <div>
             <h4 className="font-bold text-gray-800 mb-2">5. Kerangka Pembelajaran (Deep Learning)</h4>
             <div className="bg-gray-50 p-4 rounded-lg border">
                <LabelValue label="Praktik Pedagogis" value={data.desainPembelajaran?.kerangkaPembelajaran?.praktikPedagogis} />
                <div className="h-2"></div>
                <LabelValue label="Kemitraan" value={data.desainPembelajaran?.kerangkaPembelajaran?.kemitraanPembelajaran} />
                <div className="h-2"></div>
                <LabelValue label="Lingkungan" value={data.desainPembelajaran?.kerangkaPembelajaran?.lingkunganPembelajaran} />
                <div className="h-2"></div>
                <LabelValue label="Digital" value={data.desainPembelajaran?.kerangkaPembelajaran?.pemanfaatanDigital} />
             </div>
          </div>
        </div>

        <SectionHeader title="F. Langkah-Langkah Pembelajaran" />
        <div className="space-y-8">
            {(data.desainPembelajaran?.langkahLangkah || []).map((pertemuan, index) => {
                const pendahuluan = pertemuan.pendahuluan || { prinsip: 'Berkesadaran', kegiatan: [] };
                const inti = pertemuan.inti || { prinsip: 'Bermakna', kegiatan: [] };
                const penutup = pertemuan.penutup || { prinsip: 'Menggembirakan', kegiatan: [] };

                return (
                <div key={index} className="border rounded-lg p-5 bg-white shadow-sm">
                    <h4 className="font-bold text-lg text-indigo-800 mb-2">Pertemuan Ke-{pertemuan.pertemuanKe}</h4>
                    <p className="text-gray-600 italic mb-4">Tujuan: {pertemuan.tujuanPembelajaranSpesifik}</p>
                    
                    <div className="space-y-4">
                        <div>
                            <h5 className="font-bold text-gray-800 bg-green-50 p-1 inline-block rounded">
                                A. Pembukaan (15 Menit) - {pendahuluan.prinsip}
                            </h5>
                            <ul className="list-disc ml-5 mt-1 space-y-1">
                                {(pendahuluan.kegiatan || []).map((k, i) => <li key={i}>{k}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold text-gray-800 bg-blue-50 p-1 inline-block rounded">
                                B. Kegiatan Inti (60 Menit) - {inti.prinsip}
                            </h5>
                            <ul className="list-disc ml-5 mt-1 space-y-1">
                                {(inti.kegiatan || []).map((k, i) => <li key={i}>{k}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold text-gray-800 bg-orange-50 p-1 inline-block rounded">
                                C. Penutup (15 Menit) - {penutup.prinsip}
                            </h5>
                            <ul className="list-disc ml-5 mt-1 space-y-1">
                                {(penutup.kegiatan || []).map((k, i) => <li key={i}>{k}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            )})}
        </div>

        <SectionHeader title="G. Asesmen Pembelajaran" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">Asesmen Awal</h4>
                <p className="text-sm">{data.desainPembelajaran?.asesmen?.awal}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">Asesmen Proses</h4>
                <p className="text-sm">{data.desainPembelajaran?.asesmen?.proses}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">Asesmen Hasil</h4>
                <p className="text-sm">{data.desainPembelajaran?.asesmen?.hasil}</p>
            </div>
        </div>

        <div className="mt-16 flex justify-between px-10">
            <div className="text-center">
                <p>Mengetahui,</p>
                <p>Kepala Sekolah</p>
                <div className="h-20"></div>
                <p className="font-bold underline">{data.identitas.namaKepalaSekolah}</p>
                <p>NIP. {data.identitas.nipKepalaSekolah || "-"}</p>
            </div>
            <div className="text-center">
                <p>Guru Mata Pelajaran</p>
                <div className="h-20"></div>
                <p className="font-bold underline">{data.identitas.namaGuru}</p>
                <p>NIP. {data.identitas.nipGuru || "-"}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RPPView;
