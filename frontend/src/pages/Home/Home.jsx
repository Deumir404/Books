import WelcomeFrame from '../../components/WelcomeFrame/WelcomeFrame';
import Categories from '../../components/Categories/Categories';
import PopularBooks from '../../components/PopularBooks/PopularBooks';
import LibraryStats from '../../components/LibraryStats/LibraryStats';

export default function Home() {
  return (
    <div className="home-page">
      <WelcomeFrame />
      <Categories /> 
      <PopularBooks /> 
      <LibraryStats />

      <main>
        <section>
          {/* Ваш контент здесь */}
        </section>
      </main>

    </div>
  );
}

