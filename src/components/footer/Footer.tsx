import React from 'react';
import "./footer.scss"

export default class Footer extends React.Component {
    render() {
        return (
            <footer className="site-footer wrapper">
                <ul className="navigation">
                    <li><a href="#">HOME</a></li>
                    <li><a href="#">LIVE SHOWROOM</a></li>
                    <li><a href="#">PLAYGROUND</a></li>
                </ul>
                <ul className="contacts">
                    <li>Facebook:<a href="#">Georgi Atanasov</a></li>
                    <li>Instagram:<a href="#">georgi.n.atanasov</a></li>
                    <li>Google+:<a href="#">Try Again</a></li>
                    <li>Email:<a href="#">nigosto@gmail.com</a></li>
                    <li>Phone:<a href="tel:0878583131">0878583131</a></li>
                    <li>Github:<a href="#">https://github.com/nigosto</a></li>
                </ul>
                <ul className="newsletter">
                    <p>Want to stay notified for our latest news?</p>
                    <h4>Sign up for our newsletter!</h4>
                    <form action="#">
                        <input type="text" placeholder="Email" />
                        <input type="submit" value="Subscribe" />
                    </form>
                </ul>
            </footer>
        )
    }
}