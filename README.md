# Pośrednik
# Aplikacja rozwiązująca zadanie metodą pośrednika 

## Opis zagadnienia
Projekt dotyczy stworzenia aplikacji internetowej, która rozwiązuje niezbilansowane zadanie z zakresu Zagadnienia Pośrednika – przypadku, w którym łączna podaż nie musi być równa łącznemu popytowi.

Użytkownik może:
- Wprowadzić liczbę dostawców i odbiorców
- Wprowadzić dane wejściowe:  
  - podaż dla każdego dostawcy  
  - koszty zakupu  
  - popyt dla każdego odbiorcy  
  - ceny sprzedaży  
  - macierz kosztów transportu  

Aplikacja automatycznie oblicza:
- Tabelę zysków jednostkowych (różnica między ceną sprzedaży a kosztem zakupu i transportu)
- Tabelę optymalnych przewozów
- Całkowity koszt transportu i zakupu
- Całkowity przychód ze sprzedaży
- Zysk pośrednika

Wynikiem jest zoptymalizowany plan transportowy i obliczenie efektywności finansowej.

## Wykorzystane narzędzia i technologie

- **Python + WebView** – backend i uruchomienie aplikacji jako interfejsu lokalnego
- **Alpine.js** – framework JavaScript do reaktywnego zarządzania stanem aplikacji
- **Tailwind CSS** – utility-first CSS framework do stylowania komponentów
- **vis.js** – biblioteka JavaScript do wizualizacji grafów (np. sieci transportowej)
- **Visual Studio Code** – środowisko programistyczne

## Rozwiązanie przykładowego zadania

Aplikacja została przetestowana na przykładowych danych, gdzie podaż była różna od popytu. Dzięki elastycznemu algorytmowi aplikacja poprawnie wygenerowała:
- macierz zysków jednostkowych,
- plan przewozów przy maksymalizacji zysku,
- koszt całkowity, przychód oraz zysk pośrednika.
<img width="396" alt="image" src="https://github.com/user-attachments/assets/90be5851-c4de-464d-b3db-3e03d707f3c4" />
<img width="365" alt="image" src="https://github.com/user-attachments/assets/09a1853e-b288-4de6-88db-eeb9aab63396" />



