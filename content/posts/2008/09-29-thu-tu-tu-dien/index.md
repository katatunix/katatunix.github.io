---
title: Thứ tự từ điển
date: 2008-09-29
lastmod: 2023-05-07
categories: [ Programming ]
tags: [ Algorithm ]
toc: false
resources:
  - name: featured-image
    src: main.jpg
---

Các bài toán về thứ tự từ điển thì có cách giải thông thường là: viết ra giấy vài trường hợp, để ý phân tích, mò ra quy luật, từ đó có phương án implement tốt nhất.

Xét ví dụ bài toán phát biểu như sau:

> Cho số nguyên dương `n`:
>
> 1) Với dãy `a` là một hoán vị các số nguyên từ `1` đến `n`, hãy tính thứ tự từ điển của hoán vị này.
>
> 2) Ngược lại, cho số tự nhiên `k` bé hơn `n!`, hãy tìm dãy `a` là hoán vị có số thứ tự `k`.
>
> Lưu ý là thứ tự bắt đầu tính từ `0`.

Trước hết là câu _1_, giải thích qua ví dụ thì dễ dàng hơn, chẳng hạn với `n = 5` và dãy `a = [ 4, 5, 3, 1, 2 ]`. Tư tưởng là đi đếm xem có bao nhiêu hoán vị bé hơn `a`. Những hoán vị bé hơn `a` dễ thấy nhất có dạng:

    [ 1, x, x, x, x ]
    [ 2, x, x, x, x ]
    [ 3, x, x, x, x ]

trong đó mỗi dạng đều có số lượng hoán vị là `4!` suy ra tổng cộng là `3 * 4!` hoán vị.

Bây giờ xét đến dạng `[ 4, x, x, x, x ]`, bài toán có vẻ được lặp lại với kích thước giảm đi một đơn vị. Thật vậy, ta có thể bỏ số `4` để được dãy mới `[ 5, 3, 1, 2 ]` và quay lại cách tính như bước trên. Tuy nhiên có một điều cực kì quan trọng là trong dãy `[ 5, 3, 1, 2 ]` này, các số hạng không hề liên tiếp nhau: `1, 2, 3` rồi vọt lên `5`. Do đó, ta phải quan niệm số `5` là số `4` mới được. Để khi đó sẽ xét tiếp các dạng:

    [ 1, x, x, x ]
    [ 2, x, x, x ]
    [ 3, x, x, x ]

Nếu không quan niệm `5` là `4` ta sẽ vô tình xét thêm dạng `[ 4, x, x, x ]` dẫn đến kết quả sai. Để biết phải quan niệm số `5` là số mấy, đơn giản đếm xem trong dãy `[ 5, 3, 1, 2 ]` có bao nhiêu số bé hơn `5`.

Câu _2_ suy ngược lại từ câu _1_, vẫn lấy ví dụ `n = 5`, nhận xét rằng các hoán vị sẽ được sắp theo kiểu:

    4! các hoán vị dạng [ 1, x, x, x, x ]
    4! các hoán vị dạng [ 2, x, x, x, x ]
    4! các hoán vị dạng [ 3, x, x, x, x ]
    4! các hoán vị dạng [ 4, x, x, x, x ]
    4! các hoán vị dạng [ 5, x, x, x, x ]

Để tính phần tử đầu tiên của `a`, ta sẽ tìm xem dãy `a` thuộc dạng nào trong `5` dạng trên, chỉ cần lấy thương trong phép chia `k` cho `4!`. Để tính phần tử tiếp theo của `a`, ta lại đi sâu vào dạng mới tìm được với số thứ tự là số dư trong phép chia `k` cho `4!`. Cứ thế cho đến khi tính được phần tử cuối cùng của `a`.

Code minh họa:

```c
#include <stdio.h>
#include <conio.h>
#include <stdlib.h>
 
unsigned long gt[13];
 
void tinhgt() {
    gt[0] = 1;
    for (unsigned long i = 1; i < 13; i++)
        gt[i] = gt[i - 1] * i;
}
 
unsigned long thutu(int* a, int n) {
    unsigned long s = 0, i, j, k;
    for (i = 1; i <= n; i++) {
        j = 0;
        for (k = i + 1; k <= n; k++)
            if (a[k] < a[i]) j++;
        s += gt[n - i] * j;
    }
    return s + 1;
}
 
int* timday(unsigned long s, int n) {
    int* a = (int*)malloc(sizeof(int) * (n + 1));
    int* cx = (int*)malloc(sizeof(int) * (n + 1));
    int i, j, t;
    for (i = 1; i <= n; i++) cx[i] = 1;
    for (i = 1; i <= n; i++) {
        t = (s - 1) / gt[n - i] + 1;
        for (j = 1; j <= n; j++)
            if (cx[j]) {
                t--;
                if (t == 0) {
                    a[i] = j;
                    cx[j] = 0;
                    break;
                }
            }
        s = (s - 1) % gt[n - i] + 1;
    }
    return a;
}
 
void main() {
    tinhgt();
    clrscr();
 
    int i, n, a[13];
 
    printf("Nhap so nguyen duong <= 12, n = ");
    scanf("%d", &n);
    printf("\nCau a:\n");
    for (i = 1; i <= n; i++) {
        printf("Nhap a[%d] = ", i);
        scanf("%d", &a[i]);
    }
    printf("Ket qua = %lu", thutu(a, n));
 
    unsigned long s;
    printf("\n\nCau b:\n");
    printf("Nhap so nguyen duong <= %lu, s = ", gt[n]);
    scanf("%lu", &s);
    printf("Ket qua: ");
    int* b;
    b = timday(s, n);
    for (i = 1; i <= n; i++)
        printf("%d ", b[i]);
 
    getch();
}
```

2023/05/07 -- Cập nhật code minh họa F# thần chưởng:

```fsharp
let [<Literal>] MaxN = 10

let extract ls i = ls |> List.item i, ls |> List.removeAt i
  
let count cond seq = seq |> Seq.filter cond |> Seq.length

let fac = Array.create MaxN 1
for n = 1 to fac.Length-1 do fac[n] <- fac[n-1] * n

let rec indexOf = function
    | [] -> 0
    | head :: tail ->
        (tail |> count ((>) head))
        * fac[tail.Length]
        + indexOf tail

let listAt n index =
    let rec loop n index =
        if n = 0 then []
        else index / fac[n-1]
             :: loop (n-1) (index % fac[n-1])
    loop n index
    |> List.mapFold extract [1..n]
    |> fst

// Test:
indexOf [ 4; 5; 3; 1; 2 ] // 94
listAt 5 94 // [ 4; 5; 3; 1; 2 ]
```
