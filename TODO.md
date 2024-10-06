# Reste à faire

Plusieurs fonctionnalités manquent ou pourraient être améliorées pour rendre le générateur plus robuste, flexible, et aligné avec des cas d'usage réels dans les environnements de production. Voici une liste des fonctionnalités potentielles manquantes ou des améliorations qui pourraient être apportées :

## 1. **Support pour les interfaces et les unions GraphQL**

   - Actuellement, le générateur ne traite pas explicitement les interfaces (`GraphQLInterfaceType`) ou les unions (`GraphQLUnionType`). Ces types sont importants dans les schémas GraphQL pour représenter des objets polymorphes. Une gestion dédiée des interfaces et des unions dans les messages protobuf serait nécessaire pour couvrir les cas d'usage complexes.

## 2. **Gestion des types scalaires personnalisés**

   - Le générateur dispose d'un mapping de types GraphQL vers des types Protobuf (`typeMapping`). Cependant, il pourrait être amélioré pour permettre une gestion dynamique des scalaires personnalisés, qui sont couramment utilisés dans les schémas GraphQL (ex. `Email`, `URL`). Cela inclut la possibilité de définir des scalaires personnalisés dans la configuration et d'associer des types protobuf spécifiques.
   - Ajout d'une fonctionnalité pour que les scalaires personnalisés non connus ne soient pas ignorés, mais logués pour alerter les développeurs de leur présence.

## 3. **Support pour les fichiers .proto existants (gestion des imports)**

   - Dans les environnements complexes, les messages protobuf sont souvent répartis dans plusieurs fichiers. Actuellement, le générateur semble créer un seul fichier .proto. Ajouter la possibilité d'importer et de réutiliser des messages définis dans d'autres fichiers `.proto` permettrait de faciliter l'intégration dans des systèmes existants.
   - Ajout de directives dans le schéma GraphQL ou la configuration pour définir les imports nécessaires dans le fichier généré.

## 4. **Gestion des champs de map**

   - La fonction `applyTransform` du générateur a un support rudimentaire pour les champs de type `map`. Cependant, il pourrait être amélioré pour permettre une utilisation plus avancée des types `map` dans les messages Protobuf. Cela inclut une meilleure spécification des types de clés et de valeurs et une validation des transformations de type `map`.

## 5. **Ajout de métadonnées (options de champ)**

   - Protobuf permet d'ajouter des options personnalisées aux champs (`[option_name = value]`). Le générateur pourrait être étendu pour intégrer les directives ou métadonnées du schéma GraphQL aux champs Protobuf en ajoutant ces options. Cela permettrait d’annoter les champs avec des informations supplémentaires qui peuvent être utiles lors de la sérialisation/désérialisation des messages.

## 6. **Gestion des erreurs et des avertissements plus robuste**

   - Actuellement, le générateur affiche des avertissements (`console.warn`) lorsqu'il ne peut pas résoudre un type. Une gestion des erreurs plus formalisée serait utile. Par exemple, les erreurs ou avertissements devraient être collectés dans un rapport détaillé à la fin de la génération, plutôt que d'être affichés immédiatement dans la console. Cela faciliterait le débogage et l'amélioration continue du schéma GraphQL.

## 7. **Tests automatisés pour les fichiers générés**

   - Bien qu'il existe des tests unitaires pour les différentes méthodes, il n'y a pas de test d'intégration pour vérifier la génération des fichiers `.proto` dans leur ensemble. Un test pourrait charger un schéma GraphQL, générer un fichier `.proto`, puis vérifier que la sortie correspond aux attentes. Cela garantirait la qualité de bout en bout du processus de génération.

## 8. **Personnalisation des templates**

   - Actuellement, le générateur utilise un modèle (`template`) unique pour générer le fichier `.proto`. Ajouter la possibilité de fournir des modèles personnalisés via la configuration permettrait de personnaliser la structure des fichiers générés pour répondre aux besoins spécifiques de chaque projet.

## 9. **Support pour les directives additionnelles**
   - Le générateur prend en charge les directives `@exclude`, `@secure` et `@transform`. Cependant, les schémas GraphQL peuvent contenir de nombreuses autres directives personnalisées. Offrir un mécanisme d'extension pour définir et traiter des directives personnalisées supplémentaires augmenterait la flexibilité du générateur.

## 10. **Support pour les messages imbriqués**
   - La génération actuelle semble linéaire et ne tient pas compte des types imbriqués ou des champs d'objets qui pourraient eux-mêmes contenir d'autres objets. Un support complet pour la génération récursive des messages imbriqués serait nécessaire pour refléter les relations complexes présentes dans de nombreux schémas GraphQL.

## 11. **Définition d'un nom de package et d'un espace de noms**
   - Les fichiers `.proto` ont souvent des noms de package et des espaces de noms (`package my.package;`) pour organiser les messages générés. Le générateur pourrait être amélioré pour ajouter automatiquement ces informations dans les fichiers `.proto`, basées sur la configuration ou les conventions du projet.

## 12. **Cache et optimisation des performances**
   - Si le schéma GraphQL est grand ou s'il y a de nombreuses directives à traiter, le processus de génération peut être gourmand en ressources. L'ajout d'un mécanisme de cache pourrait optimiser la génération en évitant de recalculer des informations inchangées entre les exécutions successives.

## 13. **Documentation des fichiers .proto générés**
   - Actuellement, les messages et les champs générés ne sont pas documentés dans le fichier `.proto`. Ajouter des commentaires (tirés des descriptions du schéma GraphQL) pour chaque message et champ améliorerait la compréhension et la maintenabilité des fichiers `.proto` générés.

## 14. **Validation et normalisation des noms**
   - Les noms de messages, d'énums et de champs dans Protobuf doivent respecter des conventions de nommage spécifiques. Le générateur pourrait ajouter une étape de validation pour s'assurer que tous les noms respectent les normes de Protobuf, et éventuellement normaliser les noms lorsqu'ils ne sont pas conformes (par exemple, en remplaçant des caractères interdits).
