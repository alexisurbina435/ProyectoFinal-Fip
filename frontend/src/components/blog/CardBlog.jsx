import './CardBlog.css';
import {  NavLink } from "react-router-dom";

function CardBlog({ id, img, category, titulo, glosario, contenido }) {




  return (
    <div className="container-tarjet">
        <NavLink to={`/blog/${id}`} state={{id,img,category,titulo,glosario,contenido}} className='link-card'>
       <div className="cardBlog" id={`card-${id}`}>
        <img decoding='async' className="images" src={img} alt={titulo}/> 
        <div className="text-tarjet">
          <div className="card-header">
            <span className="category">{category}</span>
          </div>
          <h1 className="titulo-card">{titulo}</h1>
          <p className="glosario-card">{glosario}</p>
          {/* <p className='"contenido-card'>{contenido}</p> */}
        </div>
      </div>
        </NavLink>
      </div>
  
  );
}

export default CardBlog;