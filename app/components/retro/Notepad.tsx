interface NotepadProps {
  onClose: () => void;
}

export default function Notepad({ onClose }: NotepadProps) {
  const content = `LC3 CLUB - Lowcode & Cloud Computing Club
College of Southern Nevada
==========================================
README.TXT  |  Rev 1.0  |  April 2001
==========================================

WELCOME TO LC3 CLUB!

We are a student technology organization
dedicated to learning Microsoft platforms
and making the Internet a better place.

WHAT WE TEACH:
  - Microsoft FrontPage 2000
  - Visual Basic 6.0
  - Microsoft Access 2000
  - Windows XP (Brand NEW this year!!)
  - HTML & DHTML for the Web

UPCOMING MEETINGS:
  * Tue Apr 10  |  LAN Party (Room B-101)
                   Bring your own CAT5 cable!!
  * Tue Apr 17  |  PowerPoint Tournament
                   1st place wins a CD-R spindle
  * Tue Apr 24  |  Windows XP Install Workshop

HOW TO JOIN:
  1. Show up to Room B-101 on Tuesday @ 6pm
  2. Sign the sign-in sheet
  3. Congrats, you are a member!
  (No dues. Free pizza sometimes.)

CONTACT US:
  AIM  :  LC3ClubCSN
  ICQ  :  #31337420
  Email:  lc3club@hotmail.com
  Web  :  http://www.lc3club.cjb.net

SYSTEM REQUIREMENTS:
  OS  : Windows 98/ME/XP
  RAM : 64MB (128MB recommended)
  Net : 56k modem or broadband
  IE  : Internet Explorer 6.0 or later

NOTE: This site is best viewed at
800x600 in Internet Explorer 6.
Netscape users may see some issues.
We are sorry for the inconvenience.

------------------------------------------
(c) 2001 LC3 Club. All Rights Reserved.
Built with Microsoft FrontPage 2000.
------------------------------------------`;

  return (
    <div className="np-wrap">
      <div className="rd-alert-titlebar np-titlebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="14" height="14" viewBox="0 0 32 32" aria-hidden="true">
            <rect x="4" y="1" width="21" height="28" rx="1" fill="#fffff0" stroke="#999" strokeWidth="2"/>
            <rect x="4" y="1" width="21" height="4" fill="#4a90d9"/>
            <rect x="7" y="9"  width="14" height="2" rx="0.5" fill="#aaa"/>
            <rect x="7" y="14" width="11" height="2" rx="0.5" fill="#aaa"/>
            <rect x="7" y="19" width="13" height="2" rx="0.5" fill="#aaa"/>
          </svg>
          <span className="rd-alert-title">readme.txt - Notepad</span>
        </div>
        <div className="aim-winbtns">
          <button className="aim-wbtn aim-wbtn-min">_</button>
          <button className="aim-wbtn">□</button>
          <button className="aim-wbtn aim-wbtn-close" onClick={onClose}>×</button>
        </div>
      </div>
      <div className="np-menubar">
        {['File','Edit','Format','View','Help'].map(m => (
          <span key={m} className="rd-br-menu-item">{m}</span>
        ))}
      </div>
      <pre className="np-body">{content}</pre>
    </div>
  );
}
