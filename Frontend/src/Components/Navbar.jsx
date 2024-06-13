
import { CgAdd } from "react-icons/cg";
import './Navbar.css'
import logo from './Logo.png'
function Navbar({ fileName, handleFileChange }) {
    return (
        <div className='Aiplanet_navbar'>
            <div className='Ai_Planet-logo'>
                <img src={logo} alt="Logo" />
            </div>
            <div className='file_name-Btn'>
                <input
                    type="file"
                    id="fileInput"
                    className="form-control"
                    accept="application/pdf"
                    required
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                <span id="fileName" className="file-name">
                    {fileName}
                </span>
                <label htmlFor="fileInput" className="custom-file-label">
                    <CgAdd className='add-icon' /> <span className='upload-text'>Upload PDF</span>
                </label>
            </div>
        </div>
    );
}

export default Navbar;
