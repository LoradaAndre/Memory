"use strict";

let nbClic = 0
let carteSelect1 = 0
let carteSelect2 = 0
let nbCoups = 0
let coupsText = ""
let nbScore = 0
let scoreText = ""
let nbPaires = 0
let pairesText = ""
let nbColones = 0;
let nbLignes = 0;
let meilleurScore = ""
let pairesRestantes = 0
let listeDesCartes = []
    // obtenir la largeur et la hauteur de la zone disponible

function startMemoryGame(){

  //récupération du nombre de ligne et de colone sauvegarder

    let recupLigneCol = JSON.parse(localStorage.getItem("savePartiel"))
    if(recupLigneCol != null){
      nbColones = recupLigneCol["colonne"]
      nbLignes = recupLigneCol["ligne"]
    }


  //dans le cas ou une sauvegarde est pas enregistrée
  if(localStorage.getItem("sauvegarde_memory")==undefined){
    if(nbColones == 0 && nbLignes == 0){
      //nombre de ligne et de colonne par défault
      nbColones = 6;
      nbLignes = 4;
    }

    let total = nbColones*nbLignes
    if(total >32){
      alert("votre nombre de ligne et/ou de colonne est trop grand")
    }
    if(total %2 != 0){
      alert("le total de votre nombre de ligne et/ou de colonnes n'est pas pair")
    }
    //le jeu "démarre" quand le nombre de carte est pair et que il y a moins de 32 cartes
    if (total%2 == 0 && total <=32){
      let tabAlea = []
      //création d'un tableau allant de 1 à 32
      for(let i = 1; i<=32; i++){
        tabAlea.push(i)
      }
      console.log(tabAlea)
      for(let i=0;i<(total/2);i++){
        //choix d'un nombre aléatoire qui est dans le tableau précédent
        let nbAlea = tabAlea[Math.floor(Math.random() * tabAlea.length)]
        //supprime un element de la tabAlea (pour avoir en un seul exemplaire une carte)
        tabAlea.splice(tabAlea.indexOf(nbAlea), 1 );
        for(let j=0;j<2;j++){
          //ajout en 2 fois la carte dans un tableau "listeDesCartes"
          listeDesCartes.push(nbAlea)
        }
      }
      // algorithme de tri (Mélange de Fisher-Yates)
      for(let i=listeDesCartes.length-1;i>0;i--){
        let iAlea = Math.floor(Math.random() * (i+1))
        let bol = listeDesCartes[i]
        listeDesCartes[i] = listeDesCartes[iAlea];
        listeDesCartes[iAlea] = bol;
      }
    }
  }//dans le cas ou une sauvegarde est enregistée
  else{
    //récupération du tableau json qui est stocké dans le locaStorage
    let reprendre = JSON.parse(localStorage.getItem("sauvegarde_memory"))
    //affecter aux variables concernées les valeurs enregistées
     nbCoups = reprendre["coups"]
     nbScore = reprendre["score"]
     nbPaires = reprendre["paires"]
     pairesRestantes = reprendre["pairesRestantes"]
     nbColones = reprendre["nbColonnes"]
     nbLignes = reprendre["nbRangees"]
     listeDesCartes = reprendre["jeu"]
  }
  console.log(listeDesCartes)
  //recupération de la div contenant le jeu
  let tableauCartes = document.getElementById("jeu");

  //récupérationde la valeur de la taille (hauteur et largeur) de la div "jeu"
  let hauteurJeu = parseInt(window.getComputedStyle(tableauCartes).getPropertyValue("height"));
  let largeurJeu = parseInt(window.getComputedStyle(tableauCartes).getPropertyValue("width"));
  //taille des div contenant les cartes
  let hauteurCarte = Math.floor(hauteurJeu/nbLignes)
  let largeurCarte = Math.floor(largeurJeu/nbColones)
  let x = 0;

  if(largeurCarte < hauteurCarte){
    x = largeurCarte;
  }else if (largeurCarte >= hauteurCarte) {
    x = hauteurCarte;
  }

  tableauCartes.style.gridTemplateColumns="repeat(" + nbColones + "," + x + "px)";
  tableauCartes.style.gridTemplateRows ="repeat(" + nbLignes + "," + x + "px)";

  //création de la div qui est la carte de manière individuelle et son contenu

  for(let i=0;i<listeDesCartes.length;i++){
    if(listeDesCartes[i] != -1){
      let div = document.createElement("div")
      tableauCartes.appendChild(div)
      let image = document.createElement("img")
      div.appendChild(image)
      image.src = "src/images/js-logo.jpg"

      div.dataset.numero = listeDesCartes[i]
      console.log(div.dataset.numero)
    }

  }
  //----------------------------------------affichage dans l'entete ----------------------------------------------
  let entete = document.querySelector(".controles");
  console.log(entete)
  entete.style.display="grid";
  entete.style.gridTemplateColumns ="1fr 1fr 1fr 1fr"

  //-------------2ème élément de la grid (le 1er est le h2 "memory")
  let informations = document.createElement("div");
  informations.id = informations;
  entete.appendChild(informations)

  //---- sous-élément du 2ème élément de la grid

  //coups
  let coups = document.createElement("p")
  informations.appendChild(coups)
  coupsText = document.createTextNode("Coups: " + nbCoups)
  coups.appendChild(coupsText)


  //score
  let score = document.createElement("p")
  informations.appendChild(score)
  scoreText = document.createTextNode("Score: " + nbScore)
  score.appendChild(scoreText)


  //le nombre de paires trouvées
  let pairesTrouv = document.createElement("p")
  informations.appendChild(pairesTrouv)
  pairesText = document.createTextNode("Paires trouvées: " + nbPaires)
  pairesTrouv.appendChild(pairesText)

  //-------------3ème élément de la grid

  let para = document.createElement("div");
  para.id = para;
  entete.appendChild(para)

  //---- sous-éléments du 3ème élément de la grid

  //nombre de lignes
  let labelLigne = document.createElement("label")
  labelLigne.id="label_l"
  labelLigne.textContent = "Nombres de lignes "
  para.appendChild(labelLigne)
  //input du nombre de lignes
  let inputLignes = document.createElement("input")
  labelLigne.appendChild(inputLignes)
  inputLignes.value = nbLignes
  inputLignes.size="1"

  //nombre de colones
  console.log("nb col:" + nbColones)
  let labelRangees = document.createElement("label")
  labelRangees.id="label_c"
  labelRangees.textContent = "Nombres de rangées "
  para.appendChild(labelRangees)
  //input du nombre de colonnes
  let inputRangees = document.createElement("input")
  labelRangees.appendChild(inputRangees)
  inputRangees.value = nbColones
  inputRangees.size="1"


  //bouton permettant de recommencer la partie
  let newpartie = document.createElement("button")
  newpartie.id = "boutton"
  newpartie.textContent = "recommencer la partie"
  para.appendChild(newpartie)

  //bouton permettant de sauvegarder une partie
  let saveGame = document.createElement("button")
  saveGame.id = "boutton2"
  saveGame.textContent = "sauvegarder la partie"
  para.appendChild(saveGame)

  //-------------4ème élément de la grid
  let divScore = document.createElement("div")
  entete.appendChild(divScore)

  //affichage mots "meilleur score"
  let h3Score = document.createElement("h3")
  divScore.appendChild(h3Score)
  h3Score.textContent = "Meilleur scores"

  //affichage du meilleur score
  meilleurScore = document.createElement("h4");
  divScore.appendChild(meilleurScore)
  meilleurScore.textContent = 0;

  //récupération du mailleur score dans le localStorage
  let bestScoreSave = localStorage.getItem("score")
  meilleurScore.textContent = bestScoreSave
}

function gamePlay(event){
  let jeu = document.getElementById("jeu")
  //capte du 1er clic sur la 1ere carte
  if(nbClic == 0){
    carteSelect1 = event.currentTarget;
    console.log(carteSelect1)
    nbClic = 1;
    //affichage de la carte cliquée
    carteSelect1.firstChild.src = "src/images/"+carteSelect1.dataset.numero+".jpg"
    return; //sortie de la fonction
  }
  //capte du 2nd clic sur la 2nde carte
  else if(nbClic == 1){
    carteSelect2 = event.currentTarget;
    //affichage de la carte cliquée
    carteSelect2.firstChild.src = "src/images/"+carteSelect2.dataset.numero+".jpg"
    nbCoups += 1 //2 cartes cliquées = 1coups
    coupsText.textContent = "Coups: " + nbCoups;

    //---------------------------comparaison des deux cartes cliquées---------------------------
    //dans le cas où ou les deux cartes sont identiques et que les deux clics ne proviennent pas de la meme carte
    if(carteSelect1.dataset.numero == carteSelect2.dataset.numero && carteSelect1 != carteSelect2){
      console.log("ce sont les mêmes cartes");
      nbPaires += 1
      pairesText.textContent = "Paires trouvées: " + nbPaires;
      nbScore += 3
      scoreText.textContent = "Score: " + nbScore
      //appel de la fonction supprimerCartes au bout de 1500ms (1.5s)
      window.setTimeout(supprimerCartes,1500);
      console.log(jeu.children.length)
    }
    //dans le cas ou les deux cartes sont différentes
    else if(carteSelect1.dataset.numero != carteSelect2.dataset.numero){
      console.log("nope");
      nbScore -= 1
      scoreText.textContent = "Score: " + nbScore
      //appel de la fonction retournerCartes au bout de 1000ms (1sec)
      window.setTimeout(retournerCartes,1000);
    }


    nbClic = 0 //remis à zéro du nombre de clics
    console.log("score: " + nbScore)
    console.log("coups: " + nbCoups)
    console.log("paires: " + nbPaires)

    }
}

  //--------------------------------------timer--------------------------------------------
  function retournerCartes(){
    //l'affichage des deux cartes cliquées redeviennent "le logo js" (retournées)
    carteSelect1.firstChild.src = "src/images/js-logo.jpg"
    carteSelect2.firstChild.src = "src/images/js-logo.jpg"
  }

  function supprimerCartes(){
    //on parcourt le tableau des cartes et on affecte -1 dans le tableau, à la paire de carte qui a été trouvéé
    for(let i=0;i<listeDesCartes.length; i++){
      if(parseInt(carteSelect1.dataset.numero)==listeDesCartes[i]){
        listeDesCartes[i] = -1
      }
    }
    //on supprime les deux cartes trouvées
    jeu.removeChild(carteSelect1)
    jeu.removeChild(carteSelect2)
    //lorsqu'il n'y a plus de cartes
    if(jeu.children.length <= 0){
      alert("le jeu est terminé")
      //dans le cas ou le nombre de colone est à 6et le nombre de lignes est a 4, on appelle la fonction sauvegardeScore
      if(nbLignes == 4 && nbColones == 6){
        sauvegardeScore()
      }
    }
  }
  function refresh(){
    //on récupère la valeur saisie dans les inputs du nombre de ligne et de colonnes en les sauvegardant dans les variables correspondantes
    let caseChangeRangée = document.querySelector("#label_c input")
    nbColones = caseChangeRangée.value
    let caseChangeLigne = document.querySelector("#label_l input")
    nbLignes = caseChangeLigne.value
    //on supprime la sauvegarde du jeu
    localStorage.removeItem("sauvegarde_memory");
    //on conserve le nombre de ligne/colones saisies
    let saveLigneCol = {
    "ligne": nbLignes,
    "colonne": nbColones,
    }
    localStorage.setItem("savePartiel",JSON.stringify(saveLigneCol))
    //on rafraichit la page
    location.reload()
  }

  function sauvegardeScore(){
    let bestScore = nbScore
    //dans le cas ou un meilleur score est pas sauvegarder, on lui affecte le score obtenue à la partie
    if(localStorage["score"] == undefined){
      localStorage.setItem("score", bestScore)
      meilleurScore.textContent = bestScore
    //  console.log(localStorage.getItem("score"))
    }
    else{
      //sinon on récupère le score sauvegarder, on le compare avec le score obtenu
      let bestScoreSave = localStorage.getItem("score");
      if(bestScore >= bestScoreSave){
        //si le score obtenu est suppérieur au score enregistré, ce score devient le nouveau score à battre
        localStorage.setItem("score", bestScore)
        meilleurScore.textContent= bestScore;
        //affichage du score
        console.log("le score" + meilleurScore.textContent)
      }
    }
  }

  function sauvegarderPartie(){
    console.log(listeDesCartes)
    pairesRestantes = ((nbLignes*nbColones)/2)-nbPaires
    //variables à sauvegarder
    let sauvegarde = {
    "coups": nbCoups,
    "score": nbScore,
    "paires": nbPaires,
    "pairesRestantes": pairesRestantes,
    "nbColonnes": nbColones,
    "nbRangees": nbLignes,
    "jeu": listeDesCartes
    }
    //on modifie à la clé "sauvegarde_memory" en y remplçant par cette sauvegarde actuelle
    localStorage.setItem("sauvegarde_memory",JSON.stringify(sauvegarde))
  }
