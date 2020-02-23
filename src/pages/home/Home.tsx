import React from 'react';
import { Carousel } from 'antd'
import "./home.scss";
import { Link } from 'react-router-dom'
import Footer from '../../components/footer/Footer';

export default class Home extends React.Component {
    render() {
        return (
            <div className="home page">
                <Carousel className="home-carousel" autoplay>
                    <div className="carousel-item">
                        <h3>WELCOME TO LIVE SHOWROOM</h3>
                        <p>Jump into our virtually created world and choose the furniture that best fits your style. And not only that, you can see how the product you chose looks in a real environment! </p>
                        <Link to="/showroom" className="ant-btn ant-btn-primary ant-btn-lg carousel-btn">SHOWROOM</Link>
                    </div>
                    <div className="carousel-item">
                        <h3>DESIGN YOUR OWN ROOM</h3>
                        <p>Are you tired of searching for the best furniture designer, who completely understands what you like? Well now you can be your own designer, modeling your dream room using furniture from our showroom!</p>
                        <Link to="/playground" className="ant-btn ant-btn-primary ant-btn-lg carousel-btn">PLAYGROUND</Link>
                    </div>
                </Carousel>
                <h2 className="services-title">Everything You Need For Your Interior Design In One Place!</h2>
                <div className="services">
                    <div className="service">
                        <div className="service-img">
                            <img src="https://www.minotti.com/media/immagini/25025_z_10_MINOTTI_COMPANY_SHOWROOM_2019.jpg" alt="" />
                        </div>
                        <div className="service-info">
                            <h2>Choose From Our Live Showroom</h2>
                            <p>Quit going around your town visiting every furniture shop, just to find the perfect sofa in the last one. Now you can find everything at one place and even compare them in a perfect world simulation!</p>
                        </div>
                    </div>
                    <div className="service">
                        <div className="service-img">
                            <img src="https://i1.wp.com/www.kaldata.com/wp-content/uploads/2019/01/Amazon-Showroom.jpg?ssl=1" alt="" />
                        </div>
                        <div className="service-info">
                            <h2>Design The Room Of Your Dreams</h2>
                            <p>Say welcome to the most simplified interior design tool ever made. Now you dont have to pay half your salary to the IT guy in the closest furniture shop, but instead you can make everything yourself!</p>
                        </div>
                    </div>
                    <div className="service">
                        <div className="service-img">
                            <img src="https://i.pinimg.com/originals/1a/cc/67/1acc67a3c1f80a8b4b9561d336823f25.jpg" alt="" />
                        </div>
                        <div className="service-info">
                            <h2>Huge Variety In Our Catalog</h2>
                            <p>Find, compare and choose furniture, gathered from every shop and brought to you at one place completely free of charge! If you cant find what you are looking for in here then it surely doesnt exist :) !</p>
                        </div>
                    </div>
                </div>
                <div className="information">
                    <h2>Why You Should Choose Us?</h2>
                    <ul className="information-line">
                        <li className="information-line-item">
                            <h3>Interactive Showroom</h3>
                            <p>This is one of the most if not the most intuitive virtual showroom available to the public. With good user experience and interface our showroom offers easy and effective way of exploring the world of interior design.</p>
                        </li>
                        <li className="information-line-item">
                            <h3>Free And Easy To Use Interior Designer</h3>
                            <p>Our app offers the only free room designer on the web that doesnt require proffesional skill in interior design. This lets you unleash your imagination and bring your dream room to live.</p>
                        </li>
                        <li className="information-line-item">
                            <h3>Visualized Catalog</h3>
                            <p>Not only that we offer huge variety of products in our standart catalog, but we have made a revolution in the visualization of our stock. This virtual representation of real furniture allows our clients to make the best choice when choosing new fitment.</p>
                        </li>
                        <li className="information-line-item">
                            <h3>Wide Variety Of Products</h3>
                            <p>Find, compare and choose furniture, gathered from every shop and brought to you at one place completely free of charge! If you cant find what you are looking for in here then it doesnt exist!</p>
                        </li>
                        <li className="information-line-item">
                            <h3>Reliable Service At All Time</h3>
                            <p>We offer 24/7 client consultations and we are always ready to answer your questions or help you in your creative adventures. We are also happy to receive your honest oppinion and recommendations so that we can improve our app!</p>
                        </li>
                    </ul>
                </div>
                <Footer />
            </div>
        )
    }

    componentDidMount() {
        window.addEventListener('scroll', (e) => {
            var line = document.getElementsByClassName('information-line')[0];
            if (this.isPartlyScrolledIntoView(line)) {
                line.classList.add('animate')
            }
            var services = document.getElementsByClassName('services')[0];
            if (this.isPartlyScrolledIntoView(services)) {
                services.classList.add('animate')
            }
        });
    }

    isPartlyScrolledIntoView = (el) => {
        var rect = el.getBoundingClientRect();
        var elemTop = rect.top;
        var elemBottom = rect.bottom;
    
        var isVisible = elemTop < window.innerHeight && elemBottom >= 0;
        return isVisible;
    }

    isFullyScrolledIntoView = (el) => {
        var rect = el.getBoundingClientRect();
        var elemTop = rect.top;
        var elemBottom = rect.bottom;
    
        var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
        return isVisible;
    }
}