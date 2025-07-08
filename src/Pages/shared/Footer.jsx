import React from 'react';
import logo from '../../assets/B.png'

const Footer = () => {
    return (
        <div>
            <footer className="footer footer-horizontal footer-center bg-neutral text-neutral-content p-10">
                <aside>
                    <img 
                    className='w-30 h-30'
                    src={logo} alt="" />
                    <p className="font-bold">
                        BiteLog Ltd.
                        <br />
                        Crafted for comfort. Built for students.
                    </p>
                    <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
                </aside>
                <nav>
                </nav>
            </footer>
        </div>
    );
};

export default Footer;