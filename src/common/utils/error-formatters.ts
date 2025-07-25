import { BadRequestException, InternalServerErrorException } from "@nestjs/common";

const fieldLabels: Record<string, string> = {
    no: 'número',
    name: 'nombre',
    _id: 'Identificador',
};

export function formatDuplicateKeyError(keyValue: Record<string, any>): string {
    const campos = Object.entries(keyValue)
        .map(([key, value]) => {
            const label = fieldLabels[key] || key;
            return `${label}: ${value}`;
        })
        .join(' y ');
    return `Ya existe un registro con el ${campos}`;
}

export function handleMongoError(error: any, fallbackMessage = 'Error interno del servidor') {
    if (error?.code === 11000 && error?.keyValue) {
        throw new BadRequestException(formatDuplicateKeyError(error.keyValue));
    }
    throw new InternalServerErrorException(fallbackMessage);
}