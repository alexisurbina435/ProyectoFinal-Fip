import './CardBlog.css';
import { useEffect, useState } from 'react';
import CardBlog from './CardBlog';


function Cards() {
  const [infoBlog, setInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/data/temasBlog.json")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar los productos");
        return res.json();
      })
      .then((data) => {
        setInfo(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className='card-container'>
      {infoBlog.map((item) => (
        <CardBlog
          key={item.id}
          id={item.id}  
          img={item.img}
          category={item.category}
          titulo={item.titulo}
          glosario={item.glosario}
          contenido={item.contenido}
        />
      ))}
    </section>
  );
}

export default Cards;