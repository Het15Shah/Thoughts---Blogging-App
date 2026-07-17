import React from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


export default function RTE({ value, onChange, label, defaultValue = "" }) {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }]
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background', 'align'
  ];

  return (
    <div className='w-full'> 
      {label && <label className='inline-block mb-1.5 pl-1 font-medium text-gray-700 text-sm'>{label}</label>}

      <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
        <ReactQuill
          theme="snow"
          modules={modules}
          formats={formats}
          value={value || defaultValue}
          onChange={onChange}
          className="h-[400px] mb-10 border-0"
        />
      </div>
    </div>
  )
}


