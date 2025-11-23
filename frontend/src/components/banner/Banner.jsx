import "./Banner.css";
import BannerImg from "../../assets/images/fondo-mejorado.png"




function Banner(){
    return(
    <>  
        <section className="banner">
        <div className="content-banner">
        <img src={BannerImg} alt="Banner Principal" className="banner-img"/>
        </div>
        </section>
    </>
    )
}


export default Banner;
