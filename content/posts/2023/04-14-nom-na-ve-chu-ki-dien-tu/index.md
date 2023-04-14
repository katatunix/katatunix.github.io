---
title: 'Nôm na về chữ kí điện tử'
subtitle: Chữ kí điện tử được sử dụng như thế nào trong hành chính công
date: 2023-04-14
categories: [ Tumlum ]
tags: [ digital-signature, asymmetric-cryptography ]
featuredImage: featured.jpg
images: [ featured.jpg ]
toc: false
---

[Chữ kí điện tử](https://en.wikipedia.org/wiki/Digital_signature) là một ứng dụng của mật mã hoá bất đối xứng [asymmetric cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography).

Đại khái là, mỗi người sở hữu một cặp private key + public key. Private key phải giữ bí mật. Public key thì công khai thoải mái.

Khi có một văn bản cần kí:

* Người đó dùng private key để tạo chữ kí cho văn bản đó theo một thuật toán xác định (ví dụ RS256).
* Người khác nhận được văn bản + chữ kí + public key + tên thuật toán, sẽ kiểm chứng được đây đúng là chữ kí được sinh ra bởi chủ sở hữu của public key đó cho văn bản đó.

Thuật toán mật mã đảm bảo:

* Chỉ có người biết private key tương ứng với public key đó mới tạo được chữ kí đó, cho văn bản đó.
* Cùng một người (cùng một private key) thì với văn bản khác nhau sẽ sinh ra chữ kí khác nhau. Nghĩa là, chữ kí là duy nhất với mỗi văn bản, do đó ko thể dùng lại cho văn bản khác. Ngoài ra, hai văn bản khác nhau dù tí tẹo sẽ sinh ra hai chữ kí khác hẳn nhau nhằm chống kẻ gian tận dụng chữ kí cũ đoán (giả mạo) chữ kí mới.

Vấn đề còn lại là phải có một cơ quan uy tín chứng thực quyền sở hữu các public key trên tư cách công dân. Ví dụ public key `abcd` là của ông Nguyễn Văn A có số CCCD là `xyzw`.

Về nguyên tắc cơ quan này ko được giữ private key, vì nếu vậy họ có thể kí hộ người dân nếu muốn.

Người dân chịu trách nhiệm lưu giữ private key, có thể trong usb, phone, ổ cứng... (thím nào hay đọc tin tức về bitcoin sẽ thấy câu chuyện tương tự). Người dân sẽ phải đăng kí public key với cơ quan nói trên, và chứng minh là mình có private key tương ứng.

Tuy nhiên, thực tế để đơn giản cho người dân, thì cơ quan ấy sẽ tự chỉ định thuật toán, tạo hộ các key, đăng kí luôn, rồi cung cấp các key, cũng như các thao tác liên quan cho người dân -- thông qua app/web.

Về căn bản là vậy.
