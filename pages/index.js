import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

import {PrismaClient} from '@prisma/client';
import { useState } from 'react';

const prisma = new PrismaClient();

export default function Home({data}) {
  
  const [formData, setFormData] = useState({})
  const [movies, setmovies] = useState(data)

  async function saveMovie(e) {
    e.preventDefault()
    setmovies([...movies, formData])
    const response = await fetch('api/movies', {
      method: 'POST',
      body: JSON.stringify(formData)
    })
    return await response.json()
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Movie list</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <ul className={styles.movelist}>
          {movies.map(item => (
            <li key={item.id}>{item.title}
              <span><strong>{item.title}</strong></span>
              <span>{item.year}</span>
              <span>{item.description}</span>
              <Link href={`/movies/${item.slug}`}>
                <a>More about this movie</a>
              </Link>
            </li>
          ))}
        </ul>

        <form className={styles.movieform} onSubmit={saveMovie}>
            <input type='text' placeholder='Title' name='title' onChange={e=> setFormData({...formData, title: e.target.value})}/>
            <input type='text' placeholder='Year' name='year' onChange={e=> setFormData({...formData, year: +e.target.value})}/>
            <textarea id='' cols='30' rows='10' placeholder='Description' name='description' onChange={e=> setFormData({...formData, description: e.target.value})}/>
            <input type='text' placeholder='Slug' name='slug' onChange={e=> setFormData({...formData, slug: e.target.value})}/>
            <button type='submit'>Add movie</button>
        </form>    
        
      </main> 
    </div>
  )
}
export async function  getServerSideProps() {
  
  const movies = await prisma.movie.findMany()

  return {
    props: {
      data: movies
    }
  }
}