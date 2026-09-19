/* =====================================================
   ROYAL STAY HOTEL BOOKING SYSTEM
===================================================== */


/* =====================================================
   DARK MODE
===================================================== */

function initTheme() {

    const savedTheme =
        localStorage.getItem("theme");

    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-theme"
        );
    }


    if (
        !document.getElementById(
            "themeToggle"
        )
    ) {

        const button =
            document.createElement("button");

        button.id = "themeToggle";

        button.className =
            "theme-toggle";

        updateThemeButton(button);


        button.addEventListener(
            "click",
            function () {

                document.body.classList.toggle(
                    "dark-theme"
                );


                if (
                    document.body.classList.contains(
                        "dark-theme"
                    )
                ) {

                    localStorage.setItem(
                        "theme",
                        "dark"
                    );

                } else {

                    localStorage.setItem(
                        "theme",
                        "light"
                    );
                }


                updateThemeButton(button);

            }
        );


        const nav =
            document.querySelector(
                ".navbar nav"
            );


        if (nav) {

            nav.appendChild(button);

        } else {

            document.body.appendChild(button);
        }
    }
}


function updateThemeButton(button) {

    if (
        document.body.classList.contains(
            "dark-theme"
        )
    ) {

        button.innerHTML =
            "☀️ Light";

    } else {

        button.innerHTML =
            "🌙 Dark";
    }
}


/* =====================================================
   MAIN
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initTheme();

        initBooking();

        initPayment();

        initDashboard();

        initInvoice();

    }
);


/* =====================================================
   BOOKING
===================================================== */

function initBooking() {

    const form =
        document.getElementById(
            "bookingForm"
        );


    if (!form) return;


    const room =
        document.getElementById("room");

    const checkin =
        document.getElementById("checkin");

    const checkout =
        document.getElementById("checkout");

    const priceDisplay =
        document.getElementById(
            "pricePerNight"
        );

    const nightsDisplay =
        document.getElementById(
            "totalNights"
        );

    const totalDisplay =
        document.getElementById(
            "totalAmount"
        );


    const availability =
        document.getElementById(
            "roomAvailability"
        );


    const prices = {

        "Deluxe Room": 5000,

        "Executive Suite": 8000,

        "Presidential Suite": 15000

    };


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    checkin.min = today;

    checkout.min = today;


    function calculateTotal() {

        const selectedRoom =
            room.value;

        const price =
            prices[selectedRoom] || 0;


        priceDisplay.innerText =
            "৳" +
            price.toLocaleString();


        if (
            !checkin.value ||
            !checkout.value
        ) {

            nightsDisplay.innerText = "0";

            totalDisplay.innerText = "৳0";

            return;
        }


        const start =
            new Date(checkin.value);

        const end =
            new Date(checkout.value);


        const nights =
            Math.ceil(
                (end - start) /
                (1000 * 60 * 60 * 24)
            );


        if (nights <= 0) {

            nightsDisplay.innerText = "0";

            totalDisplay.innerText = "৳0";

            return;
        }


        const total =
            nights * price;


        nightsDisplay.innerText =
            nights;


        totalDisplay.innerText =
            "৳" +
            total.toLocaleString();
    }


    window.checkRoomAvailability =
        function () {

            const selectedRoom =
                room.value;


            if (
                !selectedRoom ||
                !checkin.value ||
                !checkout.value
            ) {

                return true;
            }


            const newStart =
                new Date(checkin.value);

            const newEnd =
                new Date(checkout.value);


            if (newEnd <= newStart) {

                availability.innerHTML =
                    "⚠️ Please select valid dates.";

                availability.className =
                    "availability-message unavailable";

                return false;
            }


            const bookings =
                JSON.parse(
                    localStorage.getItem(
                        "bookings"
                    )
                ) || [];


            const conflict =
                bookings.some(
                    function (booking) {

                        if (
                            booking.status ===
                            "Cancelled"
                        ) {
                            return false;
                        }


                        if (
                            booking.room !==
                            selectedRoom
                        ) {
                            return false;
                        }


                        const bookedStart =
                            new Date(
                                booking.checkin
                            );

                        const bookedEnd =
                            new Date(
                                booking.checkout
                            );


                        return (
                            newStart < bookedEnd &&
                            newEnd > bookedStart
                        );

                    }
                );


            if (conflict) {

                availability.innerHTML =
                    "❌ This room is already booked for these dates.";

                availability.className =
                    "availability-message unavailable";

                return false;

            } else {

                availability.innerHTML =
                    "✅ Room is available.";

                availability.className =
                    "availability-message available";

                return true;
            }

        };


    room.addEventListener(
        "change",
        function () {

            calculateTotal();

            checkRoomAvailability();

        }
    );


    checkin.addEventListener(
        "change",
        function () {

            checkout.min =
                checkin.value;

            calculateTotal();

            checkRoomAvailability();

        }
    );


    checkout.addEventListener(
        "change",
        function () {

            calculateTotal();

            checkRoomAvailability();

        }
    );


    /* Submit */

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            if (
                !window.checkRoomAvailability()
            ) {

                alert(
                    "❌ This room is not available."
                );

                return;
            }


            const selectedRoom =
                room.value;


            const price =
                prices[selectedRoom] || 0;


            const start =
                new Date(
                    checkin.value
                );


            const end =
                new Date(
                    checkout.value
                );


            const nights =
                Math.ceil(
                    (end - start) /
                    (1000 * 60 * 60 * 24)
                );


            if (nights <= 0) {

                alert(
                    "❌ Please select valid dates."
                );

                return;
            }


            const total =
                nights * price;


            /* Payment */

            const paymentMethod =
                document.getElementById(
                    "paymentMethod"
                ).value;


            const transactionId =
                document.getElementById(
                    "transactionId"
                ).value.trim();


            const cardNumber =
                document.getElementById(
                    "cardNumber"
                ).value.trim();


            const cardName =
                document.getElementById(
                    "cardName"
                ).value.trim();


            const cardExpiry =
                document.getElementById(
                    "cardExpiry"
                ).value.trim();


            const cardCVV =
                document.getElementById(
                    "cardCVV"
                ).value.trim();


            if (!paymentMethod) {

                alert(
                    "❌ Please select a payment method."
                );

                return;
            }


            if (
                paymentMethod === "bKash" ||
                paymentMethod === "Nagad"
            ) {

                if (!transactionId) {

                    alert(
                        "❌ Please enter Transaction ID."
                    );

                    return;
                }

            }


            if (
                paymentMethod === "Card"
            ) {

                if (
                    !cardNumber ||
                    !cardName ||
                    !cardExpiry ||
                    !cardCVV
                ) {

                    alert(
                        "❌ Please complete card information."
                    );

                    return;
                }
            }


            let paymentStatus =
                "Pending";


            let finalTransactionId =
                transactionId;


            if (
                paymentMethod === "Cash"
            ) {

                paymentStatus =
                    "Pending";

                finalTransactionId =
                    "Pay at Hotel";

            } else {

                paymentStatus =
                    "Paid";

            }


            const booking = {

                id:
                    "RS" +
                    Date.now(),

                name:
                    document.getElementById(
                        "name"
                    ).value,

                email:
                    document.getElementById(
                        "email"
                    ).value,

                phone:
                    document.getElementById(
                        "phone"
                    ).value,

                room:
                    selectedRoom,

                checkin:
                    checkin.value,

                checkout:
                    checkout.value,

                guests:
                    document.getElementById(
                        "guests"
                    ).value,

                nights:
                    nights,

                price:
                    price,

                total:
                    total,

                status:
                    "Confirmed",

                paymentMethod:
                    paymentMethod,

                transactionId:
                    finalTransactionId,

                paymentStatus:
                    paymentStatus
            };


            let bookings =
                JSON.parse(
                    localStorage.getItem(
                        "bookings"
                    )
                ) || [];


            bookings.push(booking);


            localStorage.setItem(
                "bookings",
                JSON.stringify(bookings)
            );


            localStorage.setItem(
                "lastBooking",
                JSON.stringify(booking)
            );


            alert(
                "✅ Booking and payment information saved successfully!"
            );


            window.location.href =
                "invoice.html";

        }
    );

}


/* =====================================================
   PAYMENT UI
===================================================== */

function initPayment() {

    const paymentMethod =
        document.getElementById(
            "paymentMethod"
        );


    if (!paymentMethod) return;


    const mobileBox =
        document.getElementById(
            "mobilePaymentBox"
        );


    const cardBox =
        document.getElementById(
            "cardPaymentBox"
        );


    const status =
        document.getElementById(
            "paymentStatus"
        );


    paymentMethod.addEventListener(
        "change",
        function () {

            const method =
                paymentMethod.value;


            mobileBox.style.display =
                "none";


            cardBox.style.display =
                "none";


            status.innerHTML = "";


            if (
                method === "bKash" ||
                method === "Nagad"
            ) {

                mobileBox.style.display =
                    "block";


                status.innerHTML =
                    "💳 Payment will be marked as Paid after entering Transaction ID.";

            }


            if (
                method === "Card"
            ) {

                cardBox.style.display =
                    "block";


                status.innerHTML =
                    "💳 Demo card payment.";

            }


            if (
                method === "Cash"
            ) {

                status.innerHTML =
                    "🏨 Payment will be made at the hotel.";

            }

        }
    );

}


/* =====================================================
   DASHBOARD
===================================================== */

function initDashboard() {

    const table =
        document.getElementById(
            "bookingTableBody"
        );


    if (!table) return;


    const loggedIn =
        localStorage.getItem(
            "adminLoggedIn"
        );


    if (loggedIn !== "true") {

        window.location.href =
            "login.html";

        return;
    }


    loadDashboard();
}


function loadDashboard() {

    const bookings =
        JSON.parse(
            localStorage.getItem(
                "bookings"
            )
        ) || [];


    const tableBody =
        document.getElementById(
            "bookingTableBody"
        );


    const noBookings =
        document.getElementById(
            "noBookings"
        );


    const totalBookings =
        document.getElementById(
            "totalBookings"
        );


    const totalRevenue =
        document.getElementById(
            "totalRevenue"
        );


    const confirmedBookings =
        document.getElementById(
            "confirmedBookings"
        );


    let revenue = 0;

    let confirmed = 0;


    bookings.forEach(
        function (booking) {

            if (
                booking.status !==
                "Cancelled"
            ) {

                confirmed++;

                revenue +=
                    Number(
                        booking.total
                    ) || 0;
            }

        }
    );


    totalBookings.innerText =
        bookings.length;


    totalRevenue.innerText =
        "৳" +
        revenue.toLocaleString();


    confirmedBookings.innerText =
        confirmed;


    tableBody.innerHTML = "";


    if (bookings.length === 0) {

        noBookings.style.display =
            "block";

        return;
    }


    noBookings.style.display =
        "none";


    bookings.forEach(
        function (booking) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

    <td>${booking.id}</td>

    <td>${booking.name}</td>

    <td>${booking.phone || "N/A"}</td>

    <td>${booking.room}</td>

    <td>${booking.checkin}</td>

    <td>${booking.checkout}</td>

    <td>${booking.guests || "N/A"}</td>

    <td>${booking.nights || "N/A"}</td>

    <td>
        ৳${Number(booking.total || 0).toLocaleString()}
    </td>

    <td>
        <span class="status ${
            booking.status === "Cancelled"
                ? "cancelled"
                : "confirmed"
        }">
            ${booking.status}
        </span>
    </td>

    <td>

        ${
            booking.status !== "Cancelled"
                ? `
                    <button
                        class="cancel-btn"
                        onclick="cancelBooking('${booking.id}')">
                        Cancel
                    </button>
                  `
                : ""
        }

        <button
            class="delete-btn"
            onclick="deleteBooking('${booking.id}')">
            Delete
        </button>

    </td>

`;


            tableBody.appendChild(row);

        }
    );

}


/* =====================================================
   DELETE
===================================================== */

function deleteBooking(id) {

    if (
        !confirm(
            "Are you sure you want to delete this booking?"
        )
    ) {
        return;
    }


    let bookings =
        JSON.parse(
            localStorage.getItem(
                "bookings"
            )
        ) || [];


    bookings =
        bookings.filter(
            function (booking) {

                return booking.id !== id;

            }
        );


    localStorage.setItem(
        "bookings",
        JSON.stringify(bookings)
    );


    loadDashboard();
}


/* =====================================================
   CANCEL
===================================================== */

function cancelBooking(id) {

    let bookings =
        JSON.parse(
            localStorage.getItem(
                "bookings"
            )
        ) || [];


    bookings =
        bookings.map(
            function (booking) {

                if (
                    booking.id === id
                ) {

                    booking.status =
                        "Cancelled";
                }


                return booking;

            }
        );


    localStorage.setItem(
        "bookings",
        JSON.stringify(bookings)
    );


    loadDashboard();
}


/* =====================================================
   SEARCH
===================================================== */

document.addEventListener(
    "input",
    function (event) {

        if (
            event.target.id !==
            "bookingSearch"
        ) {
            return;
        }


        const keyword =
            event.target.value
                .toLowerCase()
                .trim();


        const rows =
            document.querySelectorAll(
                "#bookingTableBody tr"
            );


        rows.forEach(
            function (row) {

                row.style.display =
                    row.innerText
                        .toLowerCase()
                        .includes(keyword)
                    ? ""
                    : "none";

            }
        );

    }
);


/* =====================================================
   LOGIN
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const loginForm =
            document.getElementById(
                "loginForm"
            );


        if (!loginForm) return;


        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const username =
                    document.getElementById(
                        "username"
                    ).value;


                const password =
                    document.getElementById(
                        "password"
                    ).value;


                const error =
                    document.getElementById(
                        "loginError"
                    );


                if (
                    username === "admin" &&
                    password === "12345"
                ) {

                    localStorage.setItem(
                        "adminLoggedIn",
                        "true"
                    );


                    window.location.href =
                        "dashboard.html";

                } else {

                    error.innerText =
                        "❌ Invalid username or password.";
                }

            }
        );

    }
);


/* =====================================================
   LOGOUT
===================================================== */

function logoutAdmin() {

    localStorage.removeItem(
        "adminLoggedIn"
    );


    window.location.href =
        "login.html";
}


/* =====================================================
   INVOICE
===================================================== */

function initInvoice() {

    const invoice =
        document.getElementById(
            "invoiceId"
        );


    if (!invoice) return;


    loadInvoice();
}


function loadInvoice() {

    const booking =
        JSON.parse(
            localStorage.getItem(
                "lastBooking"
            )
        );


    if (!booking) return;


    function setText(id, value) {

        const element =
            document.getElementById(id);


        if (element) {

            element.innerText =
                value;
        }
    }


    setText(
        "invoiceId",
        booking.id
    );


    setText(
        "guestName",
        booking.name
    );


    setText(
        "guestEmail",
        booking.email
    );


    setText(
        "guestPhone",
        booking.phone
    );


    setText(
        "guestCount",
        booking.guests
    );


    setText(
        "guestRoom",
        booking.room
    );


    setText(
        "guestCheckin",
        booking.checkin
    );


    setText(
        "guestCheckout",
        booking.checkout
    );


    setText(
        "invoiceRoom",
        booking.room
    );


    setText(
        "invoicePrice",
        "৳" +
        Number(
            booking.price || 0
        ).toLocaleString()
    );


    setText(
        "invoiceNights",
        booking.nights
    );


    setText(
        "invoiceTotal",
        "৳" +
        Number(
            booking.total || 0
        ).toLocaleString()
    );


    setText(
        "finalAmount",
        "৳" +
        Number(
            booking.total || 0
        ).toLocaleString()
    );


    setText(
        "invoicePaymentMethod",
        booking.paymentMethod ||
        "N/A"
    );


    setText(
        "invoiceTransactionId",
        booking.transactionId ||
        "N/A"
    );


    setText(
        "invoicePaymentStatus",
        booking.paymentStatus ||
        "Pending"
    );

}
