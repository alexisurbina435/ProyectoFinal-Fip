const FooterContact = () => {
  return (
    <address className="contact">
      <div className="contact-item">
        <svg xmlns="http://www.w3.org/2000/svg" fill="rgb(234, 88, 12)" className="bi bi-geo-alt-fill contact-icon">
          <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
        </svg>
        <p className="contact-text">Urquiza 1655, Olavarría</p>
      </div>

      <div className="contact-item">
        <svg xmlns="http://www.w3.org/2000/svg" fill="rgb(234, 88, 12)" className="bi bi-telephone-fill contact-icon">
          <path
            fillRule="evenodd"
            d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"
          />
        </svg>
        <p className="contact-text">(2284) 230252</p>
      </div>

      <div className="contact-item">
        <svg xmlns="http://www.w3.org/2000/svg" fill="rgb(234, 88, 12)" className="bi bi-envelope-fill contact-icon">
          <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z" />
        </svg>
        <p className="contact-text">superarse2020@gmail.com</p>
      </div>

      <div className="contact-item">
        <svg xmlns="http://www.w3.org/2000/svg" fill="rgb(234, 88, 12)" className="bi bi-clock-fill contact-icon">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
        </svg>
        <p className="contact-text">Lun a Vier: 7:00 - 21:00</p>
      </div>
    </address>
  );
};

export default FooterContact;