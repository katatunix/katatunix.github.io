---
title: Nôm na về chữ ký điện tử
subtitle: Chữ ký điện tử được sử dụng như thế nào trong hành chính công
description: Chữ ký điện tử được sử dụng như thế nào trong hành chính công
date: 2023-04-14
categories: [ Cryptography ]
tags: [ DigitalSignature, AsymmetricCryptography ]
toc: false
---

Nhân dịp [người dân Hà Nội được cấp chữ ký số miễn phí trên phố đi bộ hồ Gươm](https://vietnamnet.vn/nguoi-dan-ha-noi-duoc-cap-chu-ky-so-mien-phi-tren-pho-di-bo-ho-guom-2130229.html), cùng tìm hiểu -- hết sức nôm na -- về chữ ký điện tử.

<!--more-->

[Chữ ký điện tử](https://en.wikipedia.org/wiki/Digital_signature) là một ứng dụng của mật mã hoá bất đối xứng [asymmetric cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography).

Đại khái là, mỗi người sở hữu một cặp private key + public key. Private key phải giữ bí mật. Public key thì công khai thoải mái.

Khi có một văn bản cần ký:

* Người đó dùng private key để tạo chữ ký cho văn bản đó theo một thuật toán xác định (ví dụ RS256).
* Người khác nhận được văn bản + chữ ký + public key + tên thuật toán, sẽ kiểm chứng được đây đúng là chữ ký được sinh ra bởi chủ sở hữu của public key đó cho văn bản đó.

Thuật toán mật mã đảm bảo:

* Chỉ có người biết private key tương ứng với public key đó mới tạo được chữ ký đó, cho văn bản đó.
* Cùng một người (cùng một private key) thì với văn bản khác nhau sẽ sinh ra chữ ký khác nhau. Nghĩa là, chữ ký là duy nhất với mỗi văn bản, do đó ko thể dùng lại cho văn bản khác. Ngoài ra, hai văn bản khác nhau dù tí tẹo sẽ sinh ra hai chữ ký khác hẳn nhau nhằm chống kẻ gian tận dụng chữ ký cũ đoán (giả mạo) chữ ký mới.

Vấn đề còn lại là phải có một cơ quan uy tín chứng thực quyền sở hữu các public key trên tư cách công dân. Ví dụ public key `abcd` là của ông Nguyễn Văn A có số CCCD là `xyzw`.

Về nguyên tắc cơ quan này ko được giữ private key, vì nếu vậy họ có thể ký hộ người dân nếu muốn.

Người dân chịu trách nhiệm lưu giữ private key, có thể trong usb, phone, ổ cứng... (thím nào hay đọc tin tức về bitcoin sẽ thấy câu chuyện tương tự). Người dân sẽ phải đăng ký public key với cơ quan nói trên, và chứng minh là mình có private key tương ứng.

Tuy nhiên, thực tế để đơn giản cho người dân, thì cơ quan ấy sẽ tự chỉ định thuật toán, tạo hộ các key, đăng ký luôn, rồi cung cấp các key, cũng như các thao tác liên quan cho người dân -- thông qua app/web.

Về căn bản là vậy.
