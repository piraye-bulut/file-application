import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

export const SendFile = () => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [file, setFile] = useState(null);
  const [fileBase64, setFileBase64] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { currentUser } = useAuth();

  const validateFile = (file) => {
    const validTypes = [
      'image/jpeg', 
      'image/png', 
      'application/pdf', 
      'application/msword', // .doc MIME türü
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx MIME türü
    ];
    const maxSize = 1024 * 1024 * 10; // 10MB

    if (!validTypes.includes(file.type)) {
      throw new Error("Invalid file type");
    }

    if (file.size > maxSize) {
      throw new Error("File size exceeds the maximum limit");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    try {
      validateFile(file); // Dosya doğrulaması
      setFile(file);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFileBase64(reader.result);
      };
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !recipientEmail || !fileBase64) return;

    setUploading(true);

    try {
      const response = await axios.post('http://localhost:3001/files', {
        recipientEmail,
        senderEmail: currentUser.email,
        fileName: file.name,
        fileBase64,
      });

      alert('Dosya başarıyla gönderildi!');
    } catch (error) {
      console.error('Dosya gönderimi sırasında hata oluştu', error);
      alert('Dosya gönderimi sırasında hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setUploading(false);
      setFile(null);
      setRecipientEmail('');
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Dosya Gönder</h1>
          <form className="space-y-4" onSubmit={handleUpload}>
            <div>
              <label className="block text-gray-700 dark:text-white text-sm font-bold mb-2" htmlFor="recipientEmail">
                Alıcının Email Adresi
              </label>
              <input
                type="email"
                id="recipientEmail"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Alıcının email adresini girin"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-white text-sm font-bold mb-2" htmlFor="file">
                Dosya Seçin
              </label>
              <input
                type="file"
                id="file"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={handleFileChange}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={uploading}
              >
                {uploading ? 'Yükleniyor...' : 'Gönder'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SendFile;