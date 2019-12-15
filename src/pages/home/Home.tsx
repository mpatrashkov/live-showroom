import React from 'react';
import { Carousel } from 'antd'
import "./home.scss";
import {Link} from 'react-router-dom'

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
            </div>
        )
    }
}