import React from 'react';
import { Carousel } from 'antd'
import "./home.scss";
import {Link} from 'react-router-dom'
import Footer from '../../components/footer/Footer';

export default class Home extends React.Component {
    render() {
        return (
            <div className="home page">
                <Carousel className="home-carousel" autoplay>
                    <div className="carousel-item">
                        <h3>WELCOME TO LIVE SHOWROOM</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis pariatur mollitia eius enim odit? Ex sit ducimus laborum ratione rerum assumenda vero? Commodi et saepe aliquid quo doloremque facere repudiandae?</p>
                        <Link to="/showroom" className="ant-btn ant-btn-primary ant-btn-lg carousel-btn">SHOWROOM</Link>
                    </div>
                    <div className="carousel-item">
                        <h3>DESIGN YOUR OWN ROOM</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque similique obcaecati perferendis reprehenderit quae quas sed, ipsum voluptas quo dolore repudiandae soluta fugit. Tempore doloribus labore enim alias facere voluptas?</p>
                        <Link to="/playground" className="ant-btn ant-btn-primary ant-btn-lg carousel-btn">PLAYGROUND</Link>
                    </div>
                </Carousel>
                <h2 className="services-title">Everything You Need For Your Interior Design In One Place!</h2>
                <div className="services">
                    <div className="service">
                        <div className="service-img">
                            <img src="https://www.minotti.com/media/immagini/25025_z_10_MINOTTI_COMPANY_SHOWROOM_2019.jpg"/>
                        </div>
                        <div className="service-info">
                            <h2>Choose From Our Live Showroom</h2>
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam nostrum ab quam. Dolore suscipit, modi earum consequuntur minima nesciunt facere unde obcaecati quas id est exercitationem dolorem aliquid nihil provident?</p>
                        </div>
                    </div>
                    <div className="service">
                        <div className="service-img">
                            <img src="https://i1.wp.com/www.kaldata.com/wp-content/uploads/2019/01/Amazon-Showroom.jpg?ssl=1"/>
                        </div>
                        <div className="service-info">
                            <h2>Design The Room Of Your Dreams</h2>
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam nostrum ab quam. Dolore suscipit, modi earum consequuntur minima nesciunt facere unde obcaecati quas id est exercitationem dolorem aliquid nihil provident?</p>
                        </div>
                    </div>
                    <div className="service">
                        <div className="service-img">
                            <img src="https://i.pinimg.com/originals/1a/cc/67/1acc67a3c1f80a8b4b9561d336823f25.jpg"/>
                        </div>
                        <div className="service-info">
                            <h2>Huge Variaty In Our Catalog</h2>
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam nostrum ab quam. Dolore suscipit, modi earum consequuntur minima nesciunt facere unde obcaecati quas id est exercitationem dolorem aliquid nihil provident?</p>
                        </div>
                    </div>
                </div>
                <div className="information">
                    <h2>Why You Should Choose Us?</h2>
                    <ul className="information-line">
                        <li>
                            <h3>Interactive Showroom</h3>
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nisi quaerat voluptatem maiores voluptatibus eius earum non magnam rerum ipsa modi neque nam mollitia obcaecati quae, dolore autem? In, voluptate voluptatum.</p>
                        </li>
                        <li>
                            <h3>Free And Easy To Use Interior Designer</h3>
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nisi quaerat voluptatem maiores voluptatibus eius earum non magnam rerum ipsa modi neque nam mollitia obcaecati quae, dolore autem? In, voluptate voluptatum.</p>
                        </li>
                        <li>
                            <h3>Visualized Catalog</h3>
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nisi quaerat voluptatem maiores voluptatibus eius earum non magnam rerum ipsa modi neque nam mollitia obcaecati quae, dolore autem? In, voluptate voluptatum.</p>
                        </li>
                        <li>
                            <h3>Wide Variety Of Products</h3>
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nisi quaerat voluptatem maiores voluptatibus eius earum non magnam rerum ipsa modi neque nam mollitia obcaecati quae, dolore autem? In, voluptate voluptatum.</p>
                        </li>
                        <li>
                            <h3>Reliable Service At All Time</h3>
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nisi quaerat voluptatem maiores voluptatibus eius earum non magnam rerum ipsa modi neque nam mollitia obcaecati quae, dolore autem? In, voluptate voluptatum.</p>
                        </li>
                    </ul>
                </div>
                <Footer />
            </div>
        )
    }
}