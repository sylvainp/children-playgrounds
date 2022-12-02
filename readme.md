## Aireault

L'application Aireault permet de lister, noter et commenter les parcs pour enfant dans le département de l'Hérault, en France.

Réalisée en [React Native](https://reactnative.dev/), l'application suit les principes de "Clean Architecture".

L'authentification et la base de données sont gérées par [Supabase](https://supabase.com/).

Sans être connecté, l'application permet de visialiser sur une carte ([Plan ou Google Map](https://github.com/venits/react-native-map-clustering)) tous les parcs pour enfants répertoriés par [Herault Data](https://www.herault-data.fr/explore/dataset/aires-de-jeux-herault/table/?disjunctive.min_age&disjunctive.max_age).
Une fois connecté, un formulaire (realisé avec [React Hook Form](https://react-hook-form.com/)) permet de noter le parc et de laisser un commentaire.
