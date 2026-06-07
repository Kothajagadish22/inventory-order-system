from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models import Product


def get_product_or_404(db: Session, product_id: int) -> Product:
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id {product_id} not found",
        )
    return product


def handle_integrity_error(error: IntegrityError, context: str) -> None:
    message = str(error.orig) if error.orig else str(error)
    if "products_sku_key" in message or "uq_products_sku" in message or "sku" in message.lower():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Product SKU must be unique",
        ) from error
    if "customers_email_key" in message or "email" in message.lower():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Customer email must be unique",
        ) from error
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Database integrity error while {context}",
    ) from error
