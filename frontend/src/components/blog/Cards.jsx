import './CardBlog.css';
import { useEffect, useState } from 'react';
import CardBlog from './CardBlog';
import blogService from '../../services/blog.service';

function Cards() {
  const [infoBlog, setInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlog = async () => {
    try {
      const blogData = await blogService.getAllBlogs();
      setInfo(blogData);
    } catch (err) {
      setError(err.message || 'Error al cargar blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className='card-container'>
      {infoBlog.map((item) => (
        <CardBlog
          key={item.id_blog}
          id={item.id_blog}
          img={item.imagen}
          category={item.categoria}
          titulo={item.titulo}
          glosario={item.glosario}
          contenido={item.contenido}
          fecha={item.fecha_publicacion}
        />
      ))}
    </section>
  );
}

export default Cards;
