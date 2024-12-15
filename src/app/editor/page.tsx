"use client";
import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export default function EditorPage() {
  const { user, role } = useContext(AuthContext);
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);

  // Logowanie przy zmianie użytkownika i roli
  useEffect(() => {
    console.log('Sprawdzanie użytkownika i roli:', { user, role });
    if (!user) {
      console.log('Brak użytkownika - przekierowanie na /login');
      router.push('/login');
    } else if (!(role === 'editor' || role === 'admin' || role === 'superadmin')) {
      console.log('Brak odpowiedniej roli - przekierowanie na /');
      router.push('/');
    }
  }, [user, role, router]);

  useEffect(() => {
    const fetchPosts = async () => {
      console.log('Pobieranie postów z Firestore...');
      try {
        const querySnap = await getDocs(collection(db, 'posts'));
        const postsData = [];
        querySnap.forEach((docSnap) => {
          postsData.push({ id: docSnap.id, ...docSnap.data() });
        });
        console.log('Pobrane posty:', postsData);
        setPosts(postsData);
      } catch (error) {
        console.error('Błąd podczas pobierania postów:', error);
      }
    };
    if (user) {
      fetchPosts();
    }
  }, [user]);

  async function handleAddPost(e) {
    e.preventDefault();
    console.log('Dodawanie nowego postu:', { title, content });

    if (!title || !content) {
      console.warn('Tytuł i treść są wymagane!');
      return;
    }

    try {
      await addDoc(collection(db, 'posts'), {
        title: title,
        content: content,
        authorUid: user.uid, // UID aktualnego użytkownika
      });
      console.log('Dodano post:', { title, content });

      setTitle('');
      setContent('');
      // Odśwież listę
      const querySnap = await getDocs(collection(db, 'posts'));
      const postsData = [];
      querySnap.forEach((docSnap) => {
        postsData.push({ id: docSnap.id, ...docSnap.data() });
      });
      console.log('Lista postów po dodaniu:', postsData);
      setPosts(postsData);
    } catch (error) {
      console.error('Błąd podczas dodawania postu:', error);
    }
  }

  async function handleDeletePost(id) {
    console.log('Próba usunięcia postu o ID:', id);

    try {
      await deleteDoc(doc(db, 'posts', id));
      console.log('Post usunięty:', id);

      // Odśwież listę
      const querySnap = await getDocs(collection(db, 'posts'));
      const postsData = [];
      querySnap.forEach((docSnap) => {
        postsData.push({ id: docSnap.id, ...docSnap.data() });
      });
      console.log('Lista postów po usunięciu:', postsData);
      setPosts(postsData);
    } catch (error) {
      console.error('Błąd podczas usuwania postu:', error);
    }
  }

  async function handleEditPost(id, newTitle, newContent) {
    console.log('Edycja postu o ID:', id, 'Nowe dane:', { newTitle, newContent });

    try {
      await updateDoc(doc(db, 'posts', id), { title: newTitle, content: newContent });
      console.log('Post zaktualizowany:', id);

      // Odśwież listę po edycji
      const newPosts = posts.map((p) =>
          p.id === id ? { ...p, title: newTitle, content: newContent } : p
      );
      console.log('Lista postów po edycji:', newPosts);
      setPosts(newPosts);
    } catch (error) {
      console.error('Błąd podczas edycji postu:', error);
    }
  }

  if (!user || !(role === 'editor' || role === 'admin' || role === 'superadmin')) {
    return <p>Ładowanie...</p>;
  }

  return (
      <div>
        <h1>Panel Redaktora</h1>
        <form onSubmit={handleAddPost}>
          <input
              placeholder="Tytuł"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
              placeholder="Treść"
              value={content}
              onChange={(e) => setContent(e.target.value)}
          />
          <button type="submit">Dodaj artykuł</button>
        </form>

        <h2>Lista artykułów:</h2>
        <ul>
          {posts.map((post) => (
              <PostItem
                  key={post.id}
                  post={post}
                  onDelete={handleDeletePost}
                  onEdit={handleEditPost}
              />
          ))}
        </ul>
      </div>
  );
}

function PostItem({ post, onDelete, onEdit }) {
  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState(post.title);
  const [newContent, setNewContent] = useState(post.content);

  return (
      <li>
        {editMode ? (
            <div>
              <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
              />
              <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
              />
              <button
                  onClick={() => {
                    console.log('Zapisywanie edycji postu o ID:', post.id);
                    onEdit(post.id, newTitle, newContent);
                    setEditMode(false);
                  }}
              >
                Zapisz
              </button>
            </div>
        ) : (
            <div>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <button
                  onClick={() => {
                    console.log('Przełączenie na tryb edycji dla postu o ID:', post.id);
                    setEditMode(true);
                  }}
              >
                Edytuj
              </button>
              <button
                  onClick={() => {
                    console.log('Usuwanie postu o ID:', post.id);
                    onDelete(post.id);
                  }}
              >
                Usuń
              </button>
            </div>
        )}
      </li>
  );
}
