interface RecycleBinProps {
  onClose: () => void;
  onEmpty: () => void;
}

export default function RecycleBin({ onClose, onEmpty }: RecycleBinProps) {
  const files = [
    { name: 'bonzibuddy_setup.exe',                loc: 'C:\\Program Files\\',    date: '3/14/2003',  size: '2.3 MB',  type: 'Application'    },
    { name: 'my_diary_PRIVATE.doc',                loc: 'C:\\My Documents\\',     date: '11/22/2002', size: '47 KB',   type: 'Word Document'  },
    { name: 'coolwebsearch_toolbar_v2.exe',        loc: 'C:\\Downloads\\',        date: '5/18/2003',  size: '1.1 MB',  type: 'Application'    },
    { name: 'definitely_not_a_virus.mp3.exe',      loc: 'C:\\Shared\\Music\\',    date: '9/2/2002',   size: '512 KB',  type: 'Application'    },
    { name: 'homework_final_FINAL_v2_REAL.doc',    loc: 'C:\\My Documents\\',     date: '1/30/2003',  size: '23 KB',   type: 'Word Document'  },
    { name: 'geocities_backup_lc3fan.html',        loc: 'C:\\Desktop\\',          date: '6/11/2002',  size: '8 KB',    type: 'HTML File'      },
    { name: 'README_IMPORTANT_READ_THIS.txt',      loc: 'C:\\Desktop\\',          date: '4/1/2003',   size: '1 KB',    type: 'Text Document'  },
  ];

  return (
    <div className="rb-wrap">
      <div className="rd-alert-titlebar rb-titlebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="14" height="14" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M7,13 L9,31 L23,31 L25,13 Z" fill="#c8d0d8" stroke="#8090a0" strokeWidth="1.5" />
            <rect x="5" y="10" width="22" height="4" rx="1" fill="#b0bcc8" stroke="#8090a0" strokeWidth="1.5" />
            <rect x="13" y="7" width="6" height="4" rx="1" fill="#b0bcc8" stroke="#8090a0" strokeWidth="1.5" />
          </svg>
          <span className="rd-alert-title">Recycle Bin</span>
        </div>
        <div className="aim-winbtns">
          <button className="aim-wbtn aim-wbtn-min">_</button>
          <button className="aim-wbtn">□</button>
          <button className="aim-wbtn aim-wbtn-close" onClick={onClose}>×</button>
        </div>
      </div>
      <div className="np-menubar">
        {['File','Edit','View','Favorites','Tools','Help'].map(m => (
          <span key={m} className="rd-br-menu-item">{m}</span>
        ))}
      </div>
      <div className="rb-toolbar">
        <button className="rd-br-tbtn rb-empty-btn" onClick={onEmpty}>
          🗑 Empty Recycle Bin
        </button>
        <div className="rd-br-sep" />
        <div className="rb-addr-row">
          <span className="rd-br-addr-label">Address</span>
          <div className="rd-br-addr-bar">Recycle Bin</div>
        </div>
      </div>
      <div className="rb-col-header">
        <span className="rb-col rb-col-name">Name</span>
        <span className="rb-col rb-col-loc">Original Location</span>
        <span className="rb-col rb-col-date">Date Deleted</span>
        <span className="rb-col rb-col-size">Size</span>
        <span className="rb-col rb-col-type">Type</span>
      </div>
      <div className="rb-files">
        {files.map((f, i) => (
          <div key={i} className={`rb-file${i % 2 === 0 ? '' : ' rb-file-alt'}`}>
            <span className="rb-col rb-col-name">📄 {f.name}</span>
            <span className="rb-col rb-col-loc">{f.loc}</span>
            <span className="rb-col rb-col-date">{f.date}</span>
            <span className="rb-col rb-col-size">{f.size}</span>
            <span className="rb-col rb-col-type">{f.type}</span>
          </div>
        ))}
      </div>
      <div className="rb-statusbar">
        {files.length} object(s) &nbsp;|&nbsp; Total size: 4.1 MB
      </div>
    </div>
  );
}
