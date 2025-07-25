---
title: Giải bài 6 - IMO 2009
date: 2009-10-26
categories: [ Math ]
tags: [ IMO ]
---

Bài 6 trong kỳ thi Vô địch toán quốc tế 2009 (tổ chức tại Đức) là một bài tổ hợp hết sức thú vị và cũng rất hại não.

<!--more-->

## Đề bài

Giả sử $a_1, a_2 ... a_n$ là các số nguyên dương khác nhau từng cặp và $M$ là tập hợp gồm $n − 1$ số nguyên dương không chứa số $s = a_1 + a_2 + ... + a_n$. Một con châu chấu nhảy dọc theo trục thực, xuất phát từ điểm $0$ và tiến hành $n$ bước nhảy về bên phải với độ dài các bước nhảy là $a_1, a_2 ... a_n$ theo một thứ tự nào đó. Chứng minh rằng con châu chấu có thể chọn thứ tự các bước nhảy sao cho nó không bao giờ nhảy lên bất kỳ điểm nào thuộc $M$.

## Ta sẽ chứng minh bằng quy nạp

Với $n = 1, 2$: tầm thường.

Giả sử bài toán đúng tới $n = k \space (k \ge 3)$, ta sẽ chứng minh nó cũng đúng với $n = k + 1$.

Đặt dãy $P = \set{a_1, a_2 ... a_{k+1}}$ và $s = \sum{P}$.

Gọi $a_i = \max{P}$ và $m = \max{M}$. Xét mối tương quan giữa $s - a_i$ và $m$.

### Nếu $s – a_i = m$

Ta có sơ đồ:

$0 ... (s - a_i - a_j) ... (s - a_i) = m ... s$

Theo giả thiết quy nạp, đối với dãy $\set{P \setminus a_i}$ và tập $\set{M \setminus m}$ ta tìm được một thứ tự $Q$ thỏa mãn cho châu chấu. Giả sử $Q$ kết thúc với bước nhảy dài $a_j$, do $a_j < a_i$ nên ta đổi chỗ $a_j$ với $a_i$ thì châu chấu sẽ vượt qua $m$ và đây là thứ tự cần tìm cho dãy $P$ và tập $M$.

### Nếu $s – a_i > m$

Ta có sơ đồ:

$0 ... m ... (s - a_i) ... s$

Dĩ nhiên $s - a_i$ sẽ ko thuộc $M$ do $m = max{M}$. Theo giả thiết quy nạp, đối với dãy $\set{P \setminus a_i}$ và tập $\set{M \setminus m}$ ta tìm được một thứ tự $Q$ thỏa mãn cho châu chấu. Có 2 trường hợp xảy ra:

- Nếu $Q$ ko đi qua $m$ thì $Q$ rồi $a_i$ là thứ tự cần tìm cho dãy $P$ và tập $M$.
- Nếu $Q$ đi qua $m$ ở bước nhảy $a_j$, ta đổi chỗ $a_j$ với $a_i$ và đây là thứ tự cần tìm cho dãy $P$ và tập $M$.

### Nếu $s – a_i < m$

Ta có sơ đồ:

$0 ... (s - a_i) ... m ... s$

Có 2 trường hợp xảy ra:

{{< admonition tip "Nếu $s - a_i \notin M$" >}}
Theo giả thiết quy nạp, đối với dãy $\set{P \setminus a_i}$ và tập $\set{M \setminus m}$ ta tìm được một thứ tự $Q$ thỏa mãn cho châu chấu. Khi đó $Q$ rồi $a_i$ là thứ tự cần tìm cho dãy $P$ và tập $M$.
{{< /admonition >}}

{{< admonition tip "Nếu $s - a_i \in M$" >}}
Xét $k$ cặp số bao gồm $2k$ số khác nhau hoàn toàn: $(s-a_j, s-a_i-a_j)$ trong đó $a_j$ thuộc $\set{P \setminus a_i}$.

Nếu cặp nào cũng tồn tại ít nhất một số thuộc $M$ thì ta có ít nhất $k$ số khác nhau thuộc $M$, kể thêm $s - a_i$ và $m$ thì hóa ra $M$ có tới ít nhất $k+2$ phần tử, vô lý vì $M$ chỉ có $k+1$ phần tử.

Vậy tồn tại cặp $(s - a_j, s - a_i - a_j)$ đều ko thuộc $M$, như sơ đồ sau:

$0 ... (s - a_i - a_j) ... (s - a_i) ... m ... (s - a_j) ... s$

Theo giả thiết quy nạp, đối với dãy $\set{P \setminus a_i \setminus a_j}$ và tập $\set{M \setminus m \setminus s - a_i}$ ta tìm được một thứ tự $Q$ thỏa mãn cho châu chấu. Khi đó $Q$ rồi $a_i$ rồi $a_j$ là thứ tự cần tìm cho dãy $P$ và tập $M$.
{{< /admonition >}}

Vậy trong tất cả các trường hợp ta đều có đpcm và giả thiết quy nạp là đúng với mọi $n$.
